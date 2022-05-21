
uniform vec3 uDepthColor;
uniform vec3 surfaceColor;
uniform float uColorOffset;
uniform float uColorMutiplier;

varying float vElevation;


void main(){

  float mixStrengthColor = (vElevation + uColorOffset) * uColorMutiplier;

  //mix(A,B, 0.0~1.0);で切り返す
  vec3 color = mix(uDepthColor, surfaceColor, mixStrengthColor);
  gl_FragColor = vec4(color, 1.0);

}


