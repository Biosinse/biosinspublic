const finite=(...values)=>values.every(Number.isFinite);
export function calculateQ10(r1,t1,r2,t2){
 if(!finite(r1,t1,r2,t2)||r1<=0||r2<=0||t1===t2)throw new RangeError('Enter positive rates and two different finite temperatures.');
 const value=(r2/r1)**(10/(t2-t1));
 if(!Number.isFinite(value)||value<=0)throw new RangeError('These inputs exceed the supported numerical range.');
 return value;
}
export function attenuatedLight(i0,k,z){
 if(!finite(i0,k,z)||i0<0||k<0||z<0)throw new RangeError('Use finite, nonnegative surface light, attenuation and depth.');
 const fraction=Math.exp(-k*z);
 return {irradiance:i0*fraction,percent:fraction*100};
}
export function hydrogenActivityRatio(a,b){
 if(!finite(a,b))throw new RangeError('Enter two finite pH values.');
 const ratio=10**(b-a);
 if(!Number.isFinite(ratio)||ratio<=0)throw new RangeError('The pH difference exceeds the supported numerical range.');
 return ratio;
}
