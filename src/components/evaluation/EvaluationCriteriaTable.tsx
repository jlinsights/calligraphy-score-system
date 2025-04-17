import React from 'react';

const EvaluationCriteriaTable: React.FC = () => {
  return (
    <div className="criteria-section mb-6 border-b border-border pb-4">
      <h3 className="text-xl font-medium mb-2 text-foreground border-b border-primary pb-2 inline-block">심사기준</h3>
      <ol className="ml-5 pl-2 mb-4">
        <li className="mb-1">옛 법첩 기준 작품을 선정하되 서체별 구성, 여백, 조화, 묵색에 중점을 두고 작품성의 우열을 결정합니다.</li>
        <li className="mb-1">점획ㆍ결구ㆍ장법ㆍ조화의 완성미를 심사하되 아래 표의 여러 요소들을 비교 심사합니다.</li>
      </ol>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border mb-4">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-center">점획(點劃)</th>
              <th className="border border-border p-2 text-center">결구(結構)</th>
              <th className="border border-border p-2 text-center">장법(章法)</th>
              <th className="border border-border p-2 text-center">조화(調和)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-card">
              <td className="border border-border p-2 text-center">방원(方圓)</td>
              <td className="border border-border p-2 text-center">대소(大小)</td>
              <td className="border border-border p-2 text-center">농담(濃淡)</td>
              <td className="border border-border p-2 text-center">기운(氣韻)</td>
            </tr>
            <tr className="bg-card">
              <td className="border border-border p-2 text-center">곡직(曲直)</td>
              <td className="border border-border p-2 text-center">소밀(疏密)</td>
              <td className="border border-border p-2 text-center">강유(剛柔)</td>
              <td className="border border-border p-2 text-center">아속(雅俗)</td>
            </tr>
            <tr className="bg-card">
              <td className="border border-border p-2 text-center">경중(輕重)</td>
              <td className="border border-border p-2 text-center">허실(虛實)</td>
              <td className="border border-border p-2 text-center">완급(緩急)</td>
              <td className="border border-border p-2 text-center">미추(美醜)</td>
            </tr>
            <tr className="bg-card">
              <td className="border border-border p-2 text-center">장로(藏露)</td>
              <td className="border border-border p-2 text-center">향배(向背)</td>
              <td className="border border-border p-2 text-center">여백(餘白)</td>
              <td className="border border-border p-2 text-center">통변(通變)</td>
            </tr>
            <tr className="bg-card">
              <td className="border border-border p-2 text-center">형질(形質)</td>
              <td className="border border-border p-2 text-center">호응(呼應)</td>
              <td className="border border-border p-2 text-center">구성(構成)</td>
              <td className="border border-border p-2 text-center">창신(創新)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationCriteriaTable;
