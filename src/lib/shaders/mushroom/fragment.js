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
    vec2 r=resolution;
    float t=time;
    vec3 d=(gl_FragCoord.xzy*2.-r.xyy)/r.y;
    vec3 p;
    vec3 q;
    vec3 a;
    
    // Initialization
    a.z=p.y=3.;
    vec4 o=vec4(1.);
    // Condition and update
    for(int i=0;i<200;i++){
        
        q=p*rotate3D(t*.2,a);// This rotate3D function must be implemented in GLSL
        
        p+=d*min(
            length(vec3(.9+.2*q.z/(q.z+2.),q))-1.,
            length(vec3(q.z-2.5+length(q)+q.x*q.z*.1,.5*q))-1.
        );
    }
    
    o=vec4(1,3,7,1)*max((3.-length(p))/clamp(length(mod(q,.3)/.1-.9),.7,1.)*.1,.1/dot(d,d));
    gl_FragColor=o;
}

// vec3 d=(FC.xzy*2.-r.xyy)/r.y
// p,q,a;
// for(a.z=p.y=3.;o.w++<2e2;q=p*rotate3D(t*.2,a),p+=d*min(length(vec3(.9+.2*q.z/(q.z+2.),q))-1.,length(vec3(q.z-2.5+length(q)+q.x*q.z*.1,q*.5))-1.))
// for(a.z=p.y=3.;o.w++<2e2;q=p*rotate3D(t*.2,a),p+=d*min(length(vec3(.9+.2*q.z/(q.z+2.),q))-1.,length(vec3(q.z-2.5+length(q)+q.x*q.z*.1,q*.5))-1.));o=vec4(1,3,7,1)*max((3.-length(p))/clamp(length(mod(q,.3)/.1-.9),.7,1.)*.1,.1/dot(d,d));`;
