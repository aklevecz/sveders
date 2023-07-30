// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `uniform float time;
uniform vec2 resolution;
float hash(float n){return fract(sin(n)*1e4);}
float hash(vec2 p){return fract(1e4*sin(17.*p.x+p.y*.1)*(.1+abs(sin(p.y*13.+p.x))));}

float noise(float x){
    float i=floor(x);
    float f=fract(x);
    float u=f*f*(3.-2.*f);
    return mix(hash(i),hash(i+1.),u);
}
float noise(vec2 x){
    vec2 i=floor(x);
    vec2 f=fract(x);
    
    // Four corners in 2D of a tile
    float a=hash(i);
    float b=hash(i+vec2(1.,0.));
    float c=hash(i+vec2(0.,1.));
    float d=hash(i+vec2(1.,1.));
    
    // Simple 2D lerp using smoothstep envelope between the values.
    // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
    //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
    //			smoothstep(0.0, 1.0, f.y)));
    
    // Same code, with the clamps in smoothstep and common subexpressions
    // optimized away.
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

void main(){
    vec2 I=gl_FragCoord.xy;
    float iTime=time;
    // Noise macro
    #define N(x)noise(x)
    
    // Clear fragcolor
    vec4 O=vec4(0.);
    
    // Res for scaling, position and scaled coordinates
    vec2 r=resolution.xy;
    vec2 c;
    
    // Iterate from -1 to +1 in 100 steps
    for(float i=-1.;i<1.;i+=.02)
    //Compute centered position with aberation scaling
    c=(I+I-r)/r.y/(.4+i/1e2),
    //Generate random glitchy pattern (rotate in 45 degree increments)
    O+=ceil(cos((c*mat2(cos(ceil(N(c/=(.1+N(c)))*8.)*.785+vec4(0,33,11,0)))).x/
    //Generate random frequency stripes
    N(N(c)+ceil(c)+iTime)))*
    //Pick aberration color (starting red, ending in blue)
    vec4(1.+i,2.-abs(i+i),1.-i,1)/1e2;
    
    gl_FragColor=O;
}`;
