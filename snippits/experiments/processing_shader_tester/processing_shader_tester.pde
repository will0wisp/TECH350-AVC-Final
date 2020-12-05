PShader shader;
float time;
void setup(){
  size(1920,1080, P2D);
  noStroke();
  surface.setResizable(true);
  
  shader = loadShader("../patterns/animated_eye_wallpaper.frag");
  
  time = 0.;
}

void draw() {
  shader.set("u_resolution", float(width), float(height));
  shader.set("u_time", time);
  shader(shader);
  rect(0,0,width,height);
  
  if(time <= 10){
    //saveFrame("output/line-####.png");
  }
  
  time += 1./60.;
}
