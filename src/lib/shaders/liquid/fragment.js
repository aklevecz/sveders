// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `uniform vec2 resolution;
uniform float time;

#define X.211324865405187
#define Y.36602540378443
#define Z-.577350269189626
#define W.024390243902439
vec3 permute(vec3 x){return mod(x*x*34.+x,289.);}
float snoise2D(vec2 v){
	vec2 i=floor(v+(v.x+v.y)*Y),
	x0=v-i+(i.x+i.y)*X,
	j=step(x0.yx,x0),
	x1=x0+X-j,
	x3=x0+Z;
	i=mod(i,289.);
	vec3 p=permute(permute(i.y+vec3(0,j.y,1))
	+i.x+vec3(0,j.x,1)),
	m=max(.5-vec3(dot(x0,x0),dot(x1,x1),dot(x3,x3)),0.),
	x=2.*fract(p*W)-1.,
	h=abs(x)-.5,
	a0=x-floor(x+.5),
	g=a0*vec3(x0.x,x1.x,x3.x)
	+h*vec3(x0.y,x1.y,x3.y);
	m=m*m*m*m*(1.79284291400159-.85373472095314*(a0*a0+h*h));
	return.5+65.*dot(m,g);
}

float rand(vec2 st){
	return fract(sin(dot(st.xy,
				vec2(12.9898,78.233)))*
			43758.5453123);
		}
		
		void main(){
			vec2 p=(gl_FragCoord.xy*2.-resolution)/resolution.y;
			vec4 o=vec4(0.);
			
			for(float i=0.;i<7.;i++){
				p=p.yx/.6+snoise2D(p+time*.1);
				o+=sin(p.x+vec4(0.,1.,2.,3.))*.1+.05;
			}
			
			gl_FragColor=o;
			// gl_FragColor=vec4(o.r,o.r,o.r,.1);
			// gl_FragColor=vec4(1.,0.,0.,.2);
		}`;
