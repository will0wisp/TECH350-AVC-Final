#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float polyDist(vec2 _st, vec2 _center, float _exp){//Polynomial Distance from a y=-x^n sort of thing.
    vec2 relPos = _st-_center; //position, relative to center
    return (relPos.y + pow(relPos.x,_exp)) / 2.;
}
//draws the shape of an eye
float eye(vec2 _gv, vec2 _center, float _r) { //this actually draws the shape
    return -smoothstep(_r, _r*.9, pow(polyDist(_gv, _center, 1.8),.5));
}

void main(void){
    vec2 uv = (gl_FragCoord.xy)/u_resolution.y; //normalize, accounting for aspect ratio
    vec3 col = vec3(0.); //our color vector

    float scl = 12.; 
    vec2 gv = fract(uv*scl); //grid coordinates
    gv = abs(gv-.5); //moving orgin to center, symmetry across axes

    float r = .4;
    //float r = .4 + .4* sin(length(uv-.5)); //another fun option for the radius
    
    col += 1.; // we start at white, and subtract out shapes

    float offset_offset = sin(u_time);
    for(float x = 0.; x <= 1.; x++) {
        for(float y = 0.; y <= 1.; y++) {
            vec2 offSet = vec2(x,y)+offset_offset;
            col += eye(gv, offSet, r);
        }
    }


    gl_FragColor = vec4(col, 1.);
}
