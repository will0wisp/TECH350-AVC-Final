// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, vec2 _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * 0.5;

    return fract(_st);
}

float polyDist(vec2 _st, vec2 _center, float _exp, bool _fromUpRight){
    vec2 relPos = _st - _center; //position, relative to center
    float expSign = _fromUpRight? -1. : 1.;
    return expSign * (relPos.y + expSign * pow(relPos.x,_exp)) / 2.;
}

float eyeHelper(vec2 _gv, vec2 _center, float _r, bool _fromUpRight) { //this actually draws the shape
    float dist = polyDist(_gv, _center, 1.8, _fromUpRight);
    return smoothstep(_r, _r*.94, pow(dist,.5));
}
//draws the shape of an eye
vec2 eye(vec2 _gv, float _radius){ //x value = shape pattern. y value tells you how many of the 
    vec2 val =  vec2(0.);
    vec2 mult = vec2( 1., 1./3. );

    val += eyeHelper(_gv, vec2(0.,0.), _radius, false) * mult;
    val += eyeHelper(_gv, vec2(2.,0.), _radius, false) * mult;
    val += eyeHelper(_gv, vec2(1.,2.), _radius, true)  * mult;
    return val;
}

void main(void){
    vec2 uv = (gl_FragCoord.xy)/u_resolution; //normalize, accounting for aspect ratio
    uv += u_time * vec2(.1);
    vec4 col = vec4(0.);

    float scl = 12.;
    vec2 brickShape = normalize( vec2(1., 2.) );
    vec2 gv = brickTile(uv, brickShape*scl); //grid coordinates
    gv = abs(gv - .5) * 2. ;
       
    float r = 0.55+ .3 * sin(u_time); //radius

    // col += eye(gv, .83).x * vec3(0.,1.,0.);
    // col += eye(gv, .7).x * vec3(1.,-1.,0.);
    // col += eye(gv, .5).x * vec3(-1.,-0.,1.);

    for(float x = 0.; x < 4.; x++){
        vec2 fe = eye(gv, .85 - .22*x + .1*sin(u_time+(uv.x-uv.y)*2.*3.14159));
        col += vec4(vec3(fe.x),fe.y* .33333);
    }


    gl_FragColor = col;
}
