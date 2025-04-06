
import React from 'react';

const ResultsSection = () => {
  return (
    <section className="calligraphy-section">
      <h2 className="calligraphy-section-title">심사결과종합표</h2>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">부문 선택</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]">
            <option>한글 부문</option>
            <option>한문 부문</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수상 결과</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]">
            <option>전체</option>
            <option>대상</option>
            <option>최우수상</option>
            <option>우수상</option>
            <option>장려상</option>
            <option>입선</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button className="bg-[#1A1F2C] text-white px-4 py-2 rounded-md hover:bg-black transition-colors">
            결과 조회
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">심사 결과 목록</h3>
        <div className="flex gap-2">
          <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
            </svg>
            엑셀 다운로드
          </button>
          <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg>
            인쇄하기
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">순위</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">출품번호</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">작품명</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">작가명</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사위원1</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사위원2</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사위원3</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사위원4</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사위원5</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">평균점수</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">수상결과</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { rank: 1, score: 92, award: '대상' },
              { rank: 2, score: 89, award: '최우수상' },
              { rank: 3, score: 85, award: '최우수상' },
              { rank: 4, score: 82, award: '우수상' },
              { rank: 5, score: 80, award: '우수상' },
              { rank: 6, score: 79, award: '장려상' },
              { rank: 7, score: 78, award: '장려상' },
              { rank: 8, score: 75, award: '입선' },
            ].map((item, index) => (
              <tr key={index} className={index === 0 ? "bg-[#FEF7CD] hover:bg-[#FDF1A5]" : index < 3 ? "bg-[#F2FCE2] hover:bg-[#E8F7D4]" : "hover:bg-gray-50"}>
                <td className="px-4 py-3 text-center font-medium text-gray-900 border-b">{item.rank}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">HG-{index.toString().padStart(4, '0')}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">작품명 {index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">작가 {index + 1}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{item.score - 2}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{item.score}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{item.score + 1}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{item.score - 1}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{item.score}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-gray-900 border-b">{item.score}</td>
                <td className="px-4 py-3 text-sm text-center border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.award === '대상' ? 'bg-[#C53030] text-white' :
                    item.award === '최우수상' ? 'bg-[#E17055] text-white' :
                    item.award === '우수상' ? 'bg-[#F08C00] text-white' :
                    item.award === '장려상' ? 'bg-[#74B816] text-white' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {item.award}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-3">수상 결과 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-3 border border-gray-200 rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">대상</div>
            <div className="text-xl font-bold text-[#C53030]">1명</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">최우수상</div>
            <div className="text-xl font-bold text-[#E17055]">2명</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">우수상</div>
            <div className="text-xl font-bold text-[#F08C00]">2명</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">장려상</div>
            <div className="text-xl font-bold text-[#74B816]">2명</div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center">
            <div className="text-sm text-gray-500 mb-1">입선</div>
            <div className="text-xl font-bold text-gray-500">1명</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#C53030] text-white px-4 py-2 rounded-md hover:bg-[#B52020] transition-colors">
          결과 확정하기
        </button>
      </div>
    </section>
  );
};

export default ResultsSection;
