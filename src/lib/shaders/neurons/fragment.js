// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `uniform vec2 resolution;
uniform float time;

float fsnoise(vec2 c){
    return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);
}

mat3 rotate3D(float angle,vec3 axis){
    vec3 a=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float r=1.-c;
    return mat3(
        a.x*a.x*r+c,
        a.y*a.x*r+a.z*s,
        a.z*a.x*r-a.y*s,
        a.x*a.y*r-a.z*s,
        a.y*a.y*r+c,
        a.z*a.y*r+a.x*s,
        a.x*a.z*r+a.y*s,
        a.y*a.z*r-a.x*s,
        a.z*a.z*r+c
    );
}

// TODO Optimize it more
vec4 permute(vec4 x){return mod(x*x*34.+x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise3D(vec3 v){
    const vec2 C=vec2(.166666667,.33333333333);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod(i,289.);
    vec4 p=permute(permute(permute(
                i.z+vec4(0.,i1.z,i2.z,1.))
                +i.y+vec4(0.,i1.y,i2.y,1.))
                +i.x+vec4(0.,i1.x,i2.x,1.));
                vec3 ns=.142857142857*D.wyz-D.xzx;
                vec4 j=p-49.*floor(p*ns.z*ns.z);
                vec4 x_=floor(j*ns.z);
                vec4 x=x_*ns.x+ns.yyyy;
                vec4 y=floor(j-7.*x_)*ns.x+ns.yyyy;
                vec4 h=1.-abs(x)-abs(y);
                vec4 b0=vec4(x.xy,y.xy);
                vec4 b1=vec4(x.zw,y.zw);
                vec4 s0=floor(b0)*2.+1.;
                vec4 s1=floor(b1)*2.+1.;
                vec4 sh=-step(h,vec4(0.));
                vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
                vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
                vec3 p0=vec3(a0.xy,h.x);
                vec3 p1=vec3(a0.zw,h.y);
                vec3 p2=vec3(a1.xy,h.z);
                vec3 p3=vec3(a1.zw,h.w);
                vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
                p0*=norm.x;
                p1*=norm.y;
                p2*=norm.z;
                p3*=norm.w;
                vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
                m=m*m*m;
                return 42.*dot(m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
            }
            
            void main(){
                float t=time;
                vec2 r=resolution;
                vec2 FC=gl_FragCoord.xy/r.xy;
                vec3 p;
                vec4 o=vec4(0.);
                for(int i=0;i<100;++i){
                    p=vec3(FC.xy*2.-r,r)/r.x*(fsnoise(FC.xy/r)+float(i))*.1;
                    p.y-=10.;
                    p*=rotate3D(t*.1,r.yyx);
                    o.r+=.03/float(i+1)/abs(snoise3D(p)+2.*dot(sin(p),cos(p.yzx)));
                    o.gb+=texture2D(b,FC.xy/r).rg/.7;
                }
                gl_FragColor=o;
            }`;
