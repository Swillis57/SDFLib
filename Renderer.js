
class Renderer
{
	constructor() {
		this.canvas = document.querySelector("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gl = this.canvas.getContext("webgl2") || this.canvas.getContext("webgl2-experimental");

		let gl = this.gl;
		gl.clearColor(0, 0, 0, 1.0);

		this.renderProgram = this.CreateShaderProgram(document.querySelector("#quadVS"), document.querySelector("#renderPS"));
	}

	//Updates internal state with values from GUI
	Update() {

	}

	//Render the SDFs
	Draw() {

	}

	RenderLoop() {
		Update();
		Draw();

		requestAnimationFrame(this.RenderLoop.bind(this));
	}

	CreateShaderProgram(vsElement, psElement)
	{
		let gl = this.gl;
		let vs = gl.createShader(gl.VERTEX_SHADER), ps = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(vs, vsElement.textContent);
		gl.shaderSource(ps, psElement.textContent);

		gl.compileShader(vs);
		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
			console.log("[ERROR] Vertex shader compilation failed for " + vsElement.id + ": " + gl.getShaderInfoLog(vs));
		} else {
			console.log("[OK] Vertex shader compilation succeeded for " + vsElement.id);
		}

		gl.compileShader(ps);
		if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
			console.log("[ERROR] Fragment shader compilation failed for " + psElement.id + ": " + gl.getShaderInfoLog(ps));
		} else {
			console.log("[OK] Fragment shader compilation succeeded for " + psElement.id);
		}

		let program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, ps);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log("[ERROR] Program link failed: " + gl.getProgramInfoLog(program));
		} else {
			console.log("[OK] Program link succeeded for program #" + program);
		}

		gl.detachShader(program, vs);
		gl.detachShader(program, ps);
		gl.deleteShader(vs);
		gl.deleteShader(ps);

		function EnumerateUniforms(program) {
			let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
			[...Array(numUniforms).keys()].forEach((e, i, a) => {
				let info = gl.getActiveUniform(program, i);
				program[info.name] = info;
			});
		}

		EnumerateUniforms(program);

		return program;
	}
}

module.exports = Renderer;