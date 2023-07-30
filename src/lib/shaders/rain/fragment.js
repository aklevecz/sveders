// credit - https://twitter.com/XorDev
/** @type {string} */
export default /* glsl */ `// vec2 p,
//b=vec2(0,.2);
//for(float i=.9;i++<20.;)
//o+=1e-3/length(clamp(p=rotate2D(i)*(fract((FC.xy/r.y*i*.2+t*b)*rotate2D(i))-.5),-b,b)-p)*(cos(p.y/.1+vec4(0,1,2,3))+1.);
precision highp float;

uniform float time;
uniform vec2 resolution;

mat2 rotate2D(float r){
    return mat2(cos(r),sin(r),-sin(r),cos(r));
}

void main(){
    //Clear fragcolor
    vec4 outColor;
    vec2 st=gl_FragCoord.xy/resolution.y;
    //increase perceived horizontal resolution
    //has the effect of horizontally squishing the screen
    
    //Line dimensions (box)
    //distance from this is used to calculate value.
    vec2 b=vec2(0,.2);
    //Rotation matrix
    mat2 rotation;
    
    float dist;
    
    //per loop
    vec2 loopST;
    //Original Code was meant to iterate 20 times, but actually iterates 21 times
    //because i++ returns the previous value of i and not it's new value
    for(float i=.9;i<21.;++i){
        //Rotate for each iteration. The rotation of 33 and 11 radians are there to
        //appoximate sin and negative sin. 33 approximately equals 10.5 pi.
        //11 approximately equals 3.5pi. These are equivalent to 0.6 and 1.5 pi, respectively.
        //These offsets when applied to cosine make its output equivalent to sin and negative sin, respectively.
        //it's a reflected rotation so that when it's applied twice, it will be reflected normaly.
        rotation=mat2(cos(i+vec4(0,33,11,0)));
        //Scale the underlying space.
        //This step is the reason why there's a second variable for the in loop position.
        loopST=st*(i)*.1;
        // Translate downwards overtime
        loopST.y+=time*(.2);
        //Turn the points into rotated squares
        loopST=(fract((loopST)*rotation)-.5);
        //Rotate again so that the local down direction is equal to the global down direction
        //removing this causes every line to be rotated semi-randomly
        loopST=rotation*loopST;
        //determines distance between closest point inside the line and the current point.
        //used to create color falloff.
        dist=distance(clamp(loopST,-b,b),loopST);
        gl_FragColor+=.001/dist
    //Multiply the addition by his favorite color palette :)
    //All values are always above 0 here, so it creates a lot of bloom
    *(cos(loopST.y/.1+vec4(1,1,1,1))+1.);
    
    //uncomment this line to see the underlying squares and the colors the lines are being multiplied by.
    //outColor = cos(loopST.y /.1 + vec4(0,1,2,3))+1.;
}
}`;
