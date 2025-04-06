
import React from 'react';

const FeedbackSection = () => {
  return (
    <section className="calligraphy-section">
      <h2 className="calligraphy-section-title">심사의견서</h2>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">부문 선택</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]">
            <option>한글 부문</option>
            <option>한문 부문</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">심사위원</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]">
            <option>전체</option>
            <option>한석봉</option>
            <option>김정희</option>
            <option>추사</option>
            <option>우휘지</option>
            <option>왕희지</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">출품번호</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">작품명</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">작가명</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">총점</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">심사의견</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">작성일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 border-b">HG-{index.toString().padStart(4, '0')}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">작품명 {index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">작가 {index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">{85 - index * 3}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-b">
                  <button className="text-[#C53030] hover:underline">의견 보기</button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 border-b">2023-05-{(10 + index).toString().padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-3">심사의견 상세</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">출품번호: HG-0001</span>
              <span className="text-sm text-gray-500">작가명: 작가 1</span>
            </div>
            <div className="text-sm font-medium mb-2">작품명: 작품명 1</div>
            <div className="mb-2">
              <span className="text-sm bg-[#C53030] text-white px-2 py-1 rounded-md">총점: 85점</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-sm text-gray-700">
                구성이 뛰어나고 필력이 강건하다. 전통적인 서예기법을 충실히 따르면서도 개성있는 표현이 돋보인다. 
                작품의 여백 처리와 전체적인 균형감이 우수하며, 글자 간의 호응도 자연스럽다. 
                다만, 일부 획에서 깊이감이 부족한 부분이 아쉽다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">새 심사의견 작성</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">출품번호</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
                placeholder="예: HG-0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작품명</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
                placeholder="작품명"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">작가명</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
                placeholder="작가명"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">심사의견</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030] h-32" 
              placeholder="작품에 대한 심사의견을 상세히 작성해주세요."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button className="bg-[#C53030] text-white px-4 py-2 rounded-md hover:bg-[#B52020] transition-colors">
              의견 저장
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
