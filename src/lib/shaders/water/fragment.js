// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `///Render water
#define MAX 100.
#define EPS 4e-4

uniform float time;
uniform vec2 resolution;

//Classic pseudo-random hash
float hash(vec2 p)
{
    return fract(sin(p.x*75.3+p.y*94.2)*4952.);
}
//Bi-cubic value noise
float value(vec2 p)
{
    vec2 f=floor(p);
    vec2 s=p-f;
    s*=s*(3.-2.*s);
    vec2 o=vec2(0,1);
    
    return mix(mix(hash(f+o.xx),hash(f+o.yx),s.x),
    mix(hash(f+o.xy),hash(f+o.yy),s.x),s.y);
}
//Approximate SDF from fractal value noise
float dist(vec3 p)
{
    vec2 n=p.xz*.6+1.;
    mat2 m=mat2(.6754904,.7373688,-.7373688,.6754904)*2.;
    float weight=.3;
    float water=0.;
    float speed=.2;
    for(int i=0;i<10;i++)
    {
        water+=smoothstep(.1,.9,value(n+speed*time))*weight;
        n*=m;
        speed*=1.3;
        weight*=.45;
    }
    return(water+.5-p.y);
}
//Compute normals from SDF derivative
vec3 normal(vec3 p)
{
    vec2 e=vec2(4,-4)*EPS;
    return normalize(dist(p+e.yxx)*e.yxx+dist(p+e.xyx)*e.xyx+
    dist(p+e.xxy)*e.xxy+dist(p+e.yyy)*e.yyy);
}
//Render water
void main()
{
    
    vec3 ray=normalize(vec3(gl_FragCoord.xy*1.5-resolution.xy,resolution.x));
    ray.yz*=mat2(cos(.5+vec4(0,11,33,0)));
    vec3 pos=vec3(time*.1,0,10);
    vec4 mar=vec4(pos,0);
    
    for(int i=0;i<30;i++)
    {
        float stp=dist(mar.xyz);
        mar+=vec4(ray,1)*stp;
        
        if(stp<EPS||mar.w>MAX)break;
    }
    vec3 nor=normal(mar.xyz);
    vec3 sun=normalize(vec3(0,-1,9));
    vec3 ref=refract(ray,nor,1.333);
    float spec=exp(dot(ref,sun)*9.-9.);
    float fog=max(1.-mar.w/MAX,0.);
    
    vec4 color=vec4(vec3(sqrt(spec)*fog),1.-2./mar.z);
    gl_FragColor=vec4(1.-color.rgb,color.a);
    // gl_FragColor=color;
}`;
