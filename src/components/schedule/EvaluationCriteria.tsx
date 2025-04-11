
import React from 'react';

const EvaluationCriteria: React.FC = () => {
  return (
    <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
      <h3 className="text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">심사 기준</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-[#f8f9fa]">
              <th className="border border-gray-300 p-2 text-center">점획(點劃)</th>
              <th className="border border-gray-300 p-2 text-center">결구(結構)</th>
              <th className="border border-gray-300 p-2 text-center">장법(章法)</th>
              <th className="border border-gray-300 p-2 text-center">조화(調和)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 text-center">방원(方圓)</td>
              <td className="border border-gray-300 p-2 text-center">대소(大小)</td>
              <td className="border border-gray-300 p-2 text-center">농담(濃淡)</td>
              <td className="border border-gray-300 p-2 text-center">기운(氣韻)</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 text-center">곡직(曲直)</td>
              <td className="border border-gray-300 p-2 text-center">소밀(疏密)</td>
              <td className="border border-gray-300 p-2 text-center">강유(剛柔)</td>
              <td className="border border-gray-300 p-2 text-center">아속(雅俗)</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 text-center">경중(輕重)</td>
              <td className="border border-gray-300 p-2 text-center">허실(虛實)</td>
              <td className="border border-gray-300 p-2 text-center">완급(緩急)</td>
              <td className="border border-gray-300 p-2 text-center">미추(美醜)</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 text-center">장로(藏露)</td>
              <td className="border border-gray-300 p-2 text-center">향배(向背)</td>
              <td className="border border-gray-300 p-2 text-center">여백(餘白)</td>
              <td className="border border-gray-300 p-2 text-center">통변(通變)</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 text-center">형질(形質)</td>
              <td className="border border-gray-300 p-2 text-center">호응(呼應)</td>
              <td className="border border-gray-300 p-2 text-center">구성(構成)</td>
              <td className="border border-gray-300 p-2 text-center">창신(創新)</td>
            </tr>
          </tbody>
        </table>
        
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <th className="border border-gray-300 p-2 text-center bg-[#f8f9fa] w-[100px]">등급 기준</th>
              <td className="border border-gray-300 p-2 text-left pl-4 bg-white">
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
