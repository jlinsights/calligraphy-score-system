import React from 'react';

const EvaluationCriteria: React.FC = () => {
  return (
    <div className="form-section mb-6 border-b border-border pb-4">
      <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2 text-foreground border-b border-primary pb-2 inline-block">심사기준</h3>
      <ol className="ml-4 sm:ml-5 pl-2 mb-4 text-xs sm:text-sm">
        <li className="mb-1">옛 법첩 기준 작품을 선정하되 서체별 구성, 여백, 조화, 묵색에 중점을 두고 작품성의 우열을 결정합니다.</li>
        <li className="mb-1">점획ㆍ결구ㆍ장법ㆍ조화의 완성미를 심사하되 아래 표의 여러 요소들을 비교 심사합니다.</li>
      </ol>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle p-1.5 sm:p-0">
          <table className="w-full border-collapse border border-border mb-4 min-w-full">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">점획(點劃)</th>
                <th className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">결구(結構)</th>
                <th className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">장법(章法)</th>
                <th className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">조화(調和)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card">
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">방원(方圓)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">대소(大小)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">농담(濃淡)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">기운(氣韻)</td>
              </tr>
              <tr className="bg-card">
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">곡직(曲直)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">소밀(疏密)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">강유(剛柔)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">아속(雅俗)</td>
              </tr>
              <tr className="bg-card">
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">경중(輕重)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">허실(虛實)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">완급(緩急)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">미추(美醜)</td>
              </tr>
              <tr className="bg-card">
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">장로(藏露)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">향배(向背)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">여백(餘白)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">통변(通變)</td>
              </tr>
              <tr className="bg-card">
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">형질(形質)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">호응(呼應)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">구성(構成)</td>
                <td className="border border-border p-1 sm:p-2 text-center text-xs sm:text-sm">창신(創新)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table className="w-full border-collapse border border-border">
        <tbody>
          <tr>
            <th className="border border-border p-1 sm:p-2 text-center bg-muted w-[100px] text-xs sm:text-sm">등급 기준</th>
            <td className="border border-border p-1 sm:p-2 text-left pl-4 text-xs sm:text-sm">
              A 등급: 90점 이상<br/> 
              B 등급: 80점 이상<br/> 
              C 등급: 70점 이상<br/> 
              D 등급: 70점 미만
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationCriteria;
