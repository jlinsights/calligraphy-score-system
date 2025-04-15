
import React from 'react';

const GradingGuidelines: React.FC = () => {
  return (
    <>
      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">등급결정 및 동점자 처리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">등급결정 기준</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>90점 이상: 대상 및 최우수상 후보</li>
              <li>85점 이상: 우수상 후보</li>
              <li>80점 이상: 특선 후보</li>
              <li>75점 이상: 입선 후보</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">동점자 발생시 처리방안</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>조화(調和) 점수가 높은 작품우선</li>
              <li>장법(章法) 점수가 높은 작품우선</li>
              <li>심사위원 간 협의를 통한 결정</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">심사결과 확정</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>심사위원장은 종합심사 결과를 이사장에게 전달합니다.</li>
          <li>이사회는 심사결과를 검토하고 최종 승인합니다.</li>
          <li>확정된 심사결과는 수상자에게 개별 통보하며, 협회 홈페이지에 게시합니다.</li>
        </ol>
      </div>
    </>
  );
};

export default GradingGuidelines;
