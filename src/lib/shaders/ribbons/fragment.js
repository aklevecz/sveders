// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `precision highp float;

uniform float time;
uniform vec2 resolution;

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

void main(){
    float t=time;
    vec2 r=resolution;
    vec4 FC=gl_FragCoord;
    vec3 d=normalize(round(FC.xyz)*2.-r.xyy);
    vec3 p;
    vec3 q;
    p.z=1.5;
    float s;
    float i;
    vec4 o;
    
    for(int iter=0;iter<300;iter++){
        i=float(iter);
        if(mod(i,9.)<1.){
            p+=d*s;
            s=9.;
        }else{
            vec3 rotatedQ=rotate3D(t+fract(-i/9.)*t,vec3(7,5,1))*q;
            float newVal=length(max(abs(vec2(length(rotatedQ.yz)-fract(i/9.),rotatedQ.x))-.05,0.));
            s=min(newVal,s);
        }
        
        q=p;
    }
    
    o+=length(fwidth(p))*r.y/9e1;
    gl_FragColor=o;
}`;
