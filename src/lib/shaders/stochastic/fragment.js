// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `// Golf of "Quadicube" by panna_pudi
// https://shadertoy.com/view/NsByWV

//This version is 608 characters (57%) shorter!
//FabriceNeyret2 saved 12 chars
//coyote saved 7 chars
uniform float time;
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

//Square SDF
#define S length(max(s,0.))+min(0.,max(s.x,s.y))

void main()
{
    vec2 iResolution=resolution;
    float iTime=time;
    vec2 iMouse=vec2(.5,.5);
    vec2 I=gl_FragCoord.xy;
    vec4 O;
    vec2 m=iResolution.xy,//Shortened resolution
    p=(I+I-m)/m.y,//Signed uv coordinates (-1 to +1)
    u,q,s;
    
    float i=1.,z=.2,b=i;//Zoom and border
    
    //Iterate through quadtree
    for(m=(2.*iMouse.xy-m)/m.y;i++<15.&&clamp(q,m-1./z,m)==q||abs(S)*z<1.4;s=abs(u)-.35)
    
    z+=z,//zoom
    u=floor(p*z)/z,//cell coordinates
    q=abs((p-u)*z-.5),// distance to center
    b=min(b,abs(max(q.x,q.y)-.5)/z),//border
    q=u,//Back to cell coordinates for mouse
    u.x+=.1,//Offset
    O=cos(iTime*1.26+vec4(0,33,11,0)),//Rotating matrix
    u+=.16*O.wz,//Revolve
    u*=mat2(O);//Rotate
    
    s=abs(p)-vec2(1.252,.944);//Border square
    O=min(b/fwidth(p).xxxx*.7+.1,1.)+ceil(b=S);//Aprroximate AA and white background
    O*=ceil(b*b-1e-4);//Black border
    gl_FragColor=O;
}`;
