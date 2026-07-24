// Recharts 타입 안전 래퍼
// 문제: recharts 2.15.x의 class 컴포넌트가 @types/react 18.3.20의 JSX 타입 검사와 충돌
//   → TS2607/TS2786: 'XAxis' cannot be used as a JSX component
// 해결: 실제 Recharts 컴포넌트를 FC 타입으로 캐스트해 재export.
//   - JSX에서는 FC로 보여 TS2607 회피
//   - 런타임에는 실제 Recharts 컴포넌트이므로 부모 recharts 컴포넌트가
//     자식(Bar/XAxis 등)을 타입으로 인식 → 데이터 시리즈 정상 렌더링
//   (이전 FC-중개 패턴은 자식 인식이 깨져 BarChart/ScatterChart가 빈 캔버스만 그렸음)
// 참고: https://github.com/recharts/recharts/issues/3615

import type { FC } from "react";
import * as Recharts from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyProps = Record<string, any>;

export const AreaChart = Recharts.AreaChart as unknown as FC<AnyProps>;
export const Area = Recharts.Area as unknown as FC<AnyProps>;
export const BarChart = Recharts.BarChart as unknown as FC<AnyProps>;
export const Bar = Recharts.Bar as unknown as FC<AnyProps>;
export const XAxis = Recharts.XAxis as unknown as FC<AnyProps>;
export const YAxis = Recharts.YAxis as unknown as FC<AnyProps>;
export const Tooltip = Recharts.Tooltip as unknown as FC<AnyProps>;
export const ResponsiveContainer = Recharts.ResponsiveContainer as unknown as FC<AnyProps>;
export const Cell = Recharts.Cell as unknown as FC<AnyProps>;
export const ScatterChart = Recharts.ScatterChart as unknown as FC<AnyProps>;
export const Scatter = Recharts.Scatter as unknown as FC<AnyProps>;
export const CartesianGrid = Recharts.CartesianGrid as unknown as FC<AnyProps>;
export const Legend = Recharts.Legend as unknown as FC<AnyProps>;
export const ZAxis = Recharts.ZAxis as unknown as FC<AnyProps>;
