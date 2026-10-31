function finite(values){
 if(values.some(value=>typeof value!=='number'||!Number.isFinite(value)))throw new RangeError('Enter a finite number in every field.');
}
export function resourceResponse(maxRate,halfSaturation,resource,loss){
 finite([maxRate,halfSaturation,resource,loss]);
 if(maxRate<=0||halfSaturation<=0||resource<0||loss<0)throw new RangeError('Maximum rate and half-saturation must be positive; resource and losses cannot be negative.');
 const gross=maxRate/(1+halfSaturation/resource)||0;
 const net=gross-loss;
 const breakEven=maxRate>loss?loss*halfSaturation/(maxRate-loss):null;
 if(!Number.isFinite(gross)||!Number.isFinite(net)||(breakEven!==null&&!Number.isFinite(breakEven)))throw new RangeError('These values exceed the numerical range; use smaller compatible units.');
 return {gross,net,breakEven};
}
export function factorialContrast(y00,y10,y01,y11){
 finite([y00,y10,y01,y11]);
 const expected=y10+y01-y00;
 const contrast=y11-expected;
 const aAtB0=y10-y00;
 const aAtB1=y11-y01;
 const multiplicativeExpected=y00>0&&y10>=0&&y01>=0?y10*(y01/y00):null;
 if([expected,contrast,aAtB0,aAtB1].some(value=>!Number.isFinite(value))||(multiplicativeExpected!==null&&!Number.isFinite(multiplicativeExpected)))throw new RangeError('These values exceed the numerical range; use smaller compatible units.');
 return {expected,contrast,aAtB0,aAtB1,multiplicativeExpected,multiplicativeDeviation:multiplicativeExpected===null?null:y11-multiplicativeExpected};
}
