import React from 'react';

const EvaluationCriteria: React.FC = () => {
  return (
    <div className="form-section mb-6 border-b border-border pb-4">
      <h3 className="text-xl font-medium mb-2 text-foreground border-b border-primary pb-2 inline-block">심사 기준</h3>
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
            <tr>
              <td className="border border-border p-2">
                <ul className="list-disc pl-5 text-sm">
                  <li>기필의 힘과 방향</li>
                  <li>중필의 굵기와 길이</li>
                  <li>수필의 맺음과 끝맺음</li>
                  <li>점획의 연결과 변화</li>
                  <li>먹색(墨色)과 농담</li>
                </ul>
              </td>
              <td className="border border-border p-2">
                <ul className="list-disc pl-5 text-sm">
                  <li>글자의 짜임새</li>
                  <li>글자 내부의 여백</li>
                  <li>부분과 전체의 균형</li>
                  <li>글자 크기의 일관성</li>
                  <li>결구의 단정함</li>
                </ul>
              </td>
              <td className="border border-border p-2">
                <ul className="list-disc pl-5 text-sm">
                  <li>전체 구도의 균형</li>
                  <li>작품의 공간 활용</li>
                  <li>글자간 간격 조절</li>
                  <li>글자 배치의 유려함</li>
                  <li>여백의 효과적 활용</li>
                </ul>
              </td>
              <td className="border border-border p-2">
                <ul className="list-disc pl-5 text-sm">
                  <li>전체적인 조화와 일관성</li>
                  <li>서체의 특성 표현</li>
                  <li>작품의 창의성</li>
                  <li>필력의 숙련도</li>
                  <li>정신성과 예술적 표현</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="w-full border-collapse border border-border">
          <tbody>
            <tr>
              <th className="border border-border p-2 text-center bg-muted w-[100px]">등급 기준</th>
              <td className="border border-border p-2 text-left pl-4">
                A 등급: 90점 이상<br/> 
                B 등급: 80점 이상<br/> 
                C 등급: 70점 이상<br/> 
                D 등급: 70점 미만
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationCriteria;
