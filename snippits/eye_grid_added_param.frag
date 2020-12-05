#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


uniform float u_midiNotesOn[6];
uniform float u_sineVolumes[6];

uniform float u_layerRadDilation;

out vec4 fragColor;

vec2 brickTile(vec2 _st, vec2 _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * .5;

    return fract(_st);
}

float polyDist(vec2 _st, vec2 _center, float _exp, bool _fromUpRight){
    vec2 relPos = _st - _center; //position, relative to center
    float expSign = _fromUpRight? -1. : 1.;
    return expSign * (relPos.y + expSign * pow(relPos.x,_exp)) / 2.;
}
//this only works for grids laid out in an even brick pattern. can be modified for variable offset grids, etc.
float eyeDist(vec2 _gv, vec2 _center){ 
     vec2 relPos = _gv - _center;
     vec2 ev = abs(_gv);
     float exp = 1.8;
     float dist = polyDist(ev, _center, exp, false);
     float urDist = polyDist(ev, _center + vec2(1.,2.), exp, true);
     //float  rDist = polyDist(ev, _center + vec2(2.,0.), exp, false);

     return min(dist, urDist);
}

vec2 eye(vec2 _gv, float _radius){ //x value = shape pattern. y value tells you how many of the 
    vec2 val =  vec2(0.);

    val.y = smoothstep(_radius, _radius*.98, eyeDist(_gv, vec2(0.)));
    val.x = 1.;

    return val;

}

//linear interpolation from v1 to v2, based on i, which ranges from 0 to 1.
float interp(float v1, float v2, float i) {
    return (v2-v1)*i + v1;
}

void main(void){
    vec2 uv = (gl_FragCoord.xy)/u_resolution; //normalize, accounting for aspect ratio
    uv = vec2(vUV.x, vUV.y);
    vec4 col = vec4(0.); //set8io color to black

    float scl = 12.;
    vec2 brickShape = normalize( vec2(1., 2.) );
    vec2 gv = brickTile(uv, brickShape*scl); //grid coordinates
    gv = abs(gv - .5) * 2. ;
    
    float r = 0.55+ .3 * sin(u_time); //radius
    float numEyes = 6.;
    float twoPi = 6.28318530718;
    float bigRad = .7;
    float bandWidth = bigRad/ (numEyes + 1.);
    for(float x = 0.; x < numEyes; x++){
        vec2 fe = eye(gv , 
            (bigRad - bandWidth * x
                -bandWidth * u_sineVolumes[int(x)] 
                + bandWidth*sin(u_time*x+(uv.x*interp(1.,x, u_layerRadDilation)-uv.y)  *twoPi)
                ));
         //vec2 fe = eye(gv, .85 - .1*x + .1*sin(u_time+(uv.x-uv.y)*twoPi));
        //vec2 fe = eye(gv, .85 - .1*x + .1*sin(u_time+(x*uv.x*scl-uv.y)*twoPi));      // another option

        col += vec4(vec3(fe.x), fe.y/numEyes * u_midiNotesOn[int(x)] );
    }


    fragColor = col;
    float dist = eyeDist(gv, vec2(0.));
    //fragColor = vec4( vec3( step((sin(u_time)*.5+.5)*.6,dist) ), 1.);
}