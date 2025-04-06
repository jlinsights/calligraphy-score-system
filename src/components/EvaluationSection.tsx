
import React from 'react';

const EvaluationSection = () => {
  return (
    <section className="calligraphy-section">
      <h2 className="calligraphy-section-title">심사표</h2>
      
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">부문 선택</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]">
            <option>한글 부문</option>
            <option>한문 부문</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">출품 번호</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
            placeholder="예: HG-0001"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">작품명</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="예: 추사 김정희의 세한도"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작가명</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="김정희"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작품 크기</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="100x150cm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">출품일</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="2023-04-15"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">평가 항목</h3>
        <div className="space-y-4">
          {['구성미(30점)', '필력(30점)', '창의성(20점)', '표현력(20점)'].map((item, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <span className="w-28">{item}</span>
              <div className="flex-1 flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button 
                    key={score} 
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-[#C53030] hover:text-white hover:border-[#C53030] transition-colors"
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030] h-24" 
          placeholder="추가 의견이나 특이사항을 기록하세요."
        ></textarea>
      </div>

      <div className="flex justify-between">
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
          이전 작품
        </button>
        <div>
          <button className="bg-[#C53030] text-white px-4 py-2 rounded-md hover:bg-[#B52020] transition-colors mr-2">
            평가 제출
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            다음 작품
          </button>
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
