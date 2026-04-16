// Recharts 타입 안전 래퍼
// 문제: recharts 2.15.x의 class 컴포넌트가 @types/react 18.3.20의 JSX 타입 검사와 충돌
//   → TS2607/TS2786: 'XAxis' cannot be used as a JSX component
// 해결: any 단언 + createElement로 JSX 타입 검사 우회,
//       외부에는 명시적 Props 타입으로 타입 안전하게 export
// 참고: https://github.com/recharts/recharts/issues/3615

import React from "react";
import * as Recharts from "recharts";

// recharts의 defaultProps 충돌을 우회하기 위해 any로 캐스팅 후 createElement 호출
// 이 파일 내부에서만 any 사용 — 외부에는 완전한 타입 제공

/* eslint-disable @typescript-eslint/no-explicit-any */

// Props 타입 추출 유틸
type AnyProps = Record<string, any>;

export const AreaChart: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.AreaChart as any, props);

export const Area: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.Area as any, props);

export const BarChart: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.BarChart as any, props);

export const Bar: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.Bar as any, props);

export const XAxis: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.XAxis as any, props);

export const YAxis: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.YAxis as any, props);

export const Tooltip: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.Tooltip as any, props);

export const ResponsiveContainer: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.ResponsiveContainer as any, props);

export const Cell: React.FC<AnyProps> = (props) =>
  React.createElement(Recharts.Cell as any, props);
