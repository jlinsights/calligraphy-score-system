import TurndownService from 'turndown';
import { saveAs } from 'file-saver';

// Turndown 서비스 초기화
const turndownService = new TurndownService({
  headingStyle: 'atx', // # 스타일 제목
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*'
});

// 테이블을 깔끔하게 변환하기 위한 규칙 추가
turndownService.addRule('table', {
  filter: ['table'],
  replacement: function(content, node) {
    const tableElement = node as HTMLTableElement;
    let markdown = '\n\n';
    
    // 테이블 헤더 추출
    const headers = Array.from(tableElement.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
    
    if (headers.length > 0) {
      // 헤더 행 추가
      markdown += '| ' + headers.join(' | ') + ' |\n';
      
      // 구분선 행 추가
      markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    }
    
    // 테이블 내용 추출
    const rows = Array.from(tableElement.querySelectorAll('tbody tr'));
    
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
      markdown += '| ' + cells.join(' | ') + ' |\n';
    });
    
    return markdown + '\n\n';
  }
});

// 입력 필드를 변환하기 위한 규칙 추가
turndownService.addRule('input', {
  filter: ['input'],
  replacement: function(content, node) {
    const input = node as HTMLInputElement;
    return input.value || '';
  }
});

// 텍스트영역을 변환하기 위한 규칙 추가
turndownService.addRule('textarea', {
  filter: ['textarea'],
  replacement: function(content, node) {
    const textarea = node as HTMLTextAreaElement;
    return textarea.value || '';
  }
});

/**
 * HTML 요소를 Markdown으로 변환하는 함수
 * @param element 변환할 HTML 요소
 * @returns 변환된 Markdown 문자열
 */
export const convertHtmlToMarkdown = (element: HTMLElement): string => {
  // 요소를 복제하여 원본에 영향 주지 않게 함
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // 다운로드 버튼 등 불필요한 요소 제거
  const buttonContainers = clonedElement.querySelectorAll('.button-container');
  buttonContainers.forEach(container => {
    container.parentNode?.removeChild(container);
  });
  
  // Turndown 서비스 초기화
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*'
  });
  
  // 테이블 룰 강화
  turndownService.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: function(content, node) {
      return ` ${content.trim()} |`;
    }
  });
  
  turndownService.addRule('table', {
    filter: 'table',
    replacement: function(content, node) {
      const table = node as HTMLTableElement;
      const headers = Array.from(table.querySelectorAll('th')).map(() => '---');
      
      if (headers.length > 0) {
        const headerRow = `| ${headers.join(' | ')} |`;
        return `\n\n${content}\n${headerRow}\n\n`;
      }
      
      return `\n\n${content}\n\n`;
    }
  });
  
  // HTML을 마크다운으로 변환
  const markdown = turndownService.turndown(clonedElement);
  
  return markdown;
};

/**
 * Markdown 파일을 다운로드하는 함수
 * @param markdownContent Markdown 콘텐츠
 * @param filename 파일 이름
 */
export const downloadMarkdown = (markdownContent: string, filename: string): void => {
  // Blob 생성
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  
  // 다운로드 링크 생성
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  
  // 링크 클릭하여 다운로드 시작
  document.body.appendChild(link);
  link.click();
  
  // 임시 요소 제거
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }, 100);
};

/**
 * HTML 요소를 Markdown으로 변환하고 다운로드하는 함수
 * @param element 변환할 HTML 요소
 * @param filename 파일 이름
 * @returns 성공 여부
 */
export const generateMarkdownFromElement = (
  element: HTMLElement | null,
  filename: string
): boolean => {
  try {
    if (!element) {
      console.error('변환할 요소가 존재하지 않습니다.');
      return false;
    }
    
    // HTML을 마크다운으로 변환
    const markdown = convertHtmlToMarkdown(element);
    
    // 마크다운 파일 다운로드
    downloadMarkdown(markdown, filename);
    
    return true;
  } catch (error) {
    console.error('마크다운 생성 중 오류가 발생했습니다:', error);
    return false;
  }
}; 