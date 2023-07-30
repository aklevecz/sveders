// credit - https://twitter.com/XorDev
// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `uniform float time;
uniform vec2 resolution;

float opSmoothUnion(float d1,float d2,float k)
{
    float h=max(k-abs(d1-d2),0.);
    return min(d1,d2)-h*h*.25/k;
}

//-------------------------------------------------

float sdSphere(in vec3 p,in float r)
{
    return length(p)-r;
}

//---------------------------------

float map(in vec3 pos)
{
    float d=1e10;
    
    float an=sin(time);
    
    // opSmoothUnion
    {
        vec3 q=pos-vec3(0.,0.,0.);
        float d1=sdSphere(q-vec3(0.,.3+1.*an,0.),.55);
        float d2=sdSphere(q,.55);
        float dt=opSmoothUnion(d1,d2,.25);
        d=min(d,dt);
    }
    
    return d;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal(in vec3 pos)
{
    const float ep=.0001;
    vec2 e=vec2(1.,-1.)*.5773;
    return normalize(e.xyy*map(pos+e.xyy*ep)+
    e.yyx*map(pos+e.yyx*ep)+
    e.yxy*map(pos+e.yxy*ep)+
    e.xxx*map(pos+e.xxx*ep));
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow(in vec3 ro,in vec3 rd,float tmin,float tmax,const float k)
{
    float res=1.;
    float t=tmin;
    for(int i=0;i<50;i++)
    {
        float h=map(ro+rd*t);
        res=min(res,k*h/t);
        t+=clamp(h,.02,.20);
        if(res<.005||t>tmax)break;
    }
    return clamp(res,0.,1.);
}

#define AA 0

void main()
{
    vec3 tot=vec3(0.);
    
    #if AA>1
    for(int m=0;m<AA;m++)
    for(int n=0;n<AA;n++)
    {
        // pixel coordinates
        vec2 o=vec2(float(m),float(n))/float(AA)-.5;
        vec2 p=(-resolution.xy+2.*(gl_FragCoord.xy+o))/resolution.y;
        #else
        vec2 p=(-resolution.xy+2.*gl_FragCoord.xy)/resolution.y;
        #endif
        
        vec3 ro=vec3(0.,4.,8.);
        vec3 rd=normalize(vec3(p-vec2(0.,1.8),-3.5));
        
        float t=7.;
        for(int i=0;i<64;i++)
        {
            vec3 p=ro+t*rd;
            float h=map(p);
            if(abs(h)<.001||t>11.)break;
            t+=h;
        }
        
        vec3 col=vec3(0.);
        
        if(t<11.)
        {
            vec3 pos=ro+t*rd;
            vec3 nor=calcNormal(pos);
            vec3 lig=normalize(vec3(1.,.8,-.2));
            float dif=clamp(dot(nor,lig),0.,1.);
            float sha=calcSoftshadow(pos,lig,.001,1.,16.);
            float amb=.5+.5*nor.y;
            col=vec3(1.05,.1,.15)*amb+
            vec3(1.,.9,.80)*dif;
            // *sha;
        }
        
        col=sqrt(col);
        tot+=col;
        #if AA>1
    }
    tot/=float(AA*AA);
    #endif
    
    gl_FragColor=vec4(tot,1.);
}`;
