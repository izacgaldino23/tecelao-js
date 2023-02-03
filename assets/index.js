/// <reference path="./p5.global-mode.d.ts" />

const mult = 1
const altMax = 500
const raio = 100 / 100
const diminuirImg = 20
const maxUltPregos = 5

let passosMax = 1000
let pregosMax = 0
let angulo = 0
let altura = 0
let largura = 0
let img
let alturaImg
let larguraImg
let pregosImg = []
let pregosLinhas = []
let centroImg, centroLinhas
let linhas = []
let pregoAtual = 0
let context
let iniciou = false
let intervalo
let cores = {}
let passos = 0
let imgX = diminuirImg
let imgY = diminuirImg
let colorido = true
let buscarColorido = true
let procurarBranco = false
let indexCorAtual = 2
let outraCor1 = 1
let outraCor2 = 0
let mudarCor = passosMax / (colorido ? 5 : 4)
// let mudarCor = passosMax
let corAtual
let tolerancia = 70 // default 127
let corLinhaImagem
let TodasLinhas = { 0: [] }
let indexTipoLinha = 0
let exec = true

let ultimosPregos = []

function preload () {
	// img = loadImage('merilin.png')
	// img = loadImage('lion.jpg')
	// img = loadImage('monkey.png')
	// img = loadImage('dead.png')
	// img = loadImage('sad.png')
	img = loadImage('pintura.jpg')
	// img = loadImage('vangogh.jpg')
	// img = loadImage('ironman.png')
	// img = loadImage('lara.jpg')
	// img = loadImage('mulher_colorida.jpg')
	// img = loadImage('face_woman_draw.jpg')
	// img = loadImage('skull.png')
	// img = loadImage('skull_colored.png')
	// img = loadImage('let_teste.png')
	// img = loadImage('izac.png')
	// img = loadImage('rick.jpg')
	// img = loadImage('rick2.png')
}

function setup () {
	cores.vermelho = color(255, 0, 0, 70)
	cores.verde = color(0, 255, 0, 70)
	cores.azul = color(0, 0, 255, 70)
	cores.preto = color(0, 130)
	cores.cinza = color(0, 90)
	cores.claros = color(0, 70)
	cores.branco = color(255, 130)
	corAtual = cores.azul

	corLinhaImagem = colorido ? cores.preto : cores.branco

	let h = img.height
	let w = img.width

	if (h > w) {
		larguraImg = Math.floor(altMax * w / h)
		alturaImg = altMax
		imgX = (altMax - larguraImg) / 2 + diminuirImg
	} else {
		alturaImg = Math.floor(altMax * h / w)
		larguraImg = altMax
		imgY = (altMax - alturaImg) / 2 + diminuirImg
	}

	altura = altMax
	largura = altMax * 2

	createCanvas(largura * mult, altura * mult)
	frameRate(60)

	centroImg = createVector(Math.floor(altMax / 2), Math.floor(altMax / 2))
	centroLinhas = createVector(Math.floor((altMax / 2) * 3), Math.floor(altMax / 2))

	background(255)
	image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)

	desenharPregos(148)

	// line(largura / 2 + 1, 2, largura / 2 + 1, altura - 2)
	pregoAtual = Math.ceil(random(0, pregosMax - 1))
	// frameRate(5)
}

function draw () {
	if (iniciou) {
		passos++
		// desenhar linhas
		stroke(corLinhaImagem)
		strokeWeight(1)

		let l = procurarProximoPrego()
		if (l != null) {
			blendMode(BLEND)
			l.draw()

			noStroke()
			fill(255)
			rect(largura - 52, 0, 100, 50)
			fill(0)
			text(passos, largura - 50, 20)

			stroke(0, 0, 0, 70)
			strokeWeight(1)
			blendMode(procurarBranco ? BLEND : MULTIPLY)
			l.drawDesenho()

			TodasLinhas[ indexTipoLinha ].push(l)

			if (passos % mudarCor == 0) {
				indexTipoLinha++
				TodasLinhas[ indexTipoLinha ] = []
				// desenharPregos(pregosMax + 2)

				if (!colorido) {
					// ===================== tons de cinza
					fill(255)
					if (passos == mudarCor) {
						corAtual = cores.cinza
						tolerancia = 110
					} else if (passos == mudarCor * 2) {
						corAtual = cores.claros
						tolerancia = 150
					}
					else {
						procurarBranco = true
						corAtual = cores.branco
						tolerancia = 200
						corLinhaImagem = cores.preto
						blendMode(BLEND)
						noStroke()
						fill(0)
						rect(0, 0, altMax, altMax)
					}

					if (buscarColorido) {
						blendMode(BLEND)
						image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)
					}

					if (passos >= passosMax) {
						blendMode(BLEND)
						image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)
						if (buscarColorido) {
							passosMax *= 2
							mudarCor = passosMax / (colorido ? 5 : 4)
							mudarCores()
						}
						else noLoop()
					}
				} else {
					// ===================== Divizão de três cores
					indexCorAtual--
					if (indexCorAtual == 1) {
						outraCor1 = 2
						corAtual = cores.verde
					} else if (indexCorAtual == 0) {
						outraCor2 = 1
						corAtual = cores.vermelho
					} else {
						indexCorAtual = 4
						corAtual = cores.claros
						corLinhaImagem = cores.branco
						blendMode(BLEND)
						noStroke()
						fill(255)
						rect(0, 0, altMax, altMax)
					}
					// corAtual = (passos == mudarCor) ? cores.verde : cores.vermelho
					blendMode(BLEND)
					image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)

					if (passos >= passosMax) {
						console.log('acabou')
						// redesenhar()
						noLoop()
					}
				}
			}

		} else {
			if (!colorido) {
				image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)
				mudarCores()
			} else {
				noLoop()
				console.log('Não há mais pontos de interesse')
			}
		}

	} else if (!exec) {
		teste()
	}
}

function teste() {
	exec = true
	context = canvas.getContext('2d', {willReadFrequently: true});

	for (let i=0; i < width; i+= 10) {
		for (let j=0; j < height; j+=10) {
			data = context.getImageData(i, j, 1, 1).data
			// blendMode(BLEND)
			noStroke()
			fill(data[ 0 ], data[ 1 ], data[ 2 ])
			rect(i, j, 10, 10)
		}
	}
}

function desenharPregos (max) {
	pregosMax = max
	angulo = 360 / pregosMax
	pregosImg = []
	// Montar circulo
	for (let i = 0; i < pregosMax; i++) {
		let ang = i * angulo
		let x = Math.floor((centroImg.x) * Math.cos(ang * (PI / 180)))
		let y = Math.floor((centroImg.x) * Math.sin(ang * (PI / 180)))

		pregosImg.push(new Prego(x + centroImg.x, y + centroImg.y, ang))
	}

	strokeWeight(2)
	pregosImg.map(p => {
		p.draw()
	})
}

function iniciar () {
	iniciou = true
}

function pausar () {
	iniciou = false
}

function procurarProximoPrego () {
	// let melhorPrego = (pregoAtual + 1) >= pregosMax ? pregoAtual - 1 : pregoAtual + 1
	let melhorPrego = -1
	let maiorEscuridao = 0
	let linha = {}
	let cor
	context = canvas.getContext('2d')

	// if (colorido) {
	// 	melhorPrego = Math.floor(Math.random() * pregosMax)
	// 	linha = buscarCoresLinhas(melhorPrego)
	// 	cor = buscarCorDominante(linha)
	// } else {
	// }
	for (k in pregosImg) {
		if (ultimosPregos.indexOf(k) != -1 || k == pregoAtual) continue

		// calcular escuridao da linha
		let result = calcularEscuridao(k)
		escuridao = result.escuridao
		linha = result.linha
		if (escuridao > maiorEscuridao) {
			maiorEscuridao = escuridao
			melhorPrego = k
		}
	}
	if (maiorEscuridao == 0) {
		console.log(pregoAtual)
		return null
	}
	cor = corAtual
	// cor = buscarCorDominante(linha)

	let l = new Linha(pregosImg[ pregoAtual ], pregosImg[ melhorPrego ], cor)
	// penultimoPrego = ultimoPrego
	// ultimoPrego = pregoAtual
	
	if (ultimosPregos.length == maxUltPregos) ultimosPregos.shift()
	ultimosPregos.push(pregoAtual)

	pregoAtual = melhorPrego
	
	console.log(pregoAtual, ultimosPregos)

	return l
}

function calcularEscuridao (n) {
	let escuridao = 0
	let atual = pregosImg[ pregoAtual ]
	let indice = pregosImg[ n ]

	let d = Math.floor(dist(atual.pos.x, atual.pos.y, indice.pos.x, indice.pos.y))
	let ang = atan2(indice.pos.y - atual.pos.y, indice.pos.x - atual.pos.x)

	let coresCanvas, x, y
	let cose = Math.cos(ang)
	let sine = Math.sin(ang)
	let linha = {}
	for (i = 1; i <= d; i += 2) {
		x = i * cose
		y = i * sine

		coresCanvas = context.getImageData(x + atual.pos.x, y + atual.pos.y, 1, 1).data
		if (colorido) {
			if (indexCorAtual > 2 && coresCanvas[ 0 ] < 127 && coresCanvas[ 1 ] < 127 && coresCanvas[ 2 ] < 127) escuridao++
			else if (coresCanvas[ indexCorAtual ] > 127 && coresCanvas[ outraCor1 ] < 150 && coresCanvas[ outraCor2 ] < 150) escuridao++
		} else {
			// let chave = `${coresCanvas[ 0 ]}.${coresCanvas[ 1 ]}.${coresCanvas[ 2 ]}`
			// linha[ chave ] = (chave in linha) ? linha[ chave ] + 1 : 1
			if (procurarBranco) {
				if (coresCanvas[ 0 ] > tolerancia && coresCanvas[ 1 ] > tolerancia && coresCanvas[ 2 ] > tolerancia) escuridao++
			} else {
				if (coresCanvas[ 0 ] < tolerancia && coresCanvas[ 1 ] < tolerancia && coresCanvas[ 2 ] < tolerancia) escuridao++
			}
		}

		if (escuridao > d / 4) break
	}

	return { escuridao, linha }
}

function buscarCoresLinhas (n) {
	let atual = pregosImg[ pregoAtual ]
	let indice = pregosImg[ n ]

	let d = Math.floor(dist(atual.pos.x, atual.pos.y, indice.pos.x, indice.pos.y))
	let ang = atan2(indice.pos.y - atual.pos.y, indice.pos.x - atual.pos.x)

	let coresCanvas, x, y
	let cose = Math.cos(ang)
	let sine = Math.sin(ang)
	let linha = {}
	for (i = 1; i <= d; i += 2) {
		x = i * cose
		y = i * sine

		coresCanvas = context.getImageData(x + atual.pos.x, y + atual.pos.y, 1, 1).data
		let chave = `${coresCanvas[ 0 ]}.${coresCanvas[ 1 ]}.${coresCanvas[ 2 ]}`
		linha[ chave ] = (chave in linha) ? linha[ chave ] + 1 : 1
	}

	return linha
}

function buscarCorDominante (linha = {}) {
	let cor
	let qtd = 0

	for (k in linha) {
		if (k == '255.255.255') continue
		if (qtd < linha[ k ]) {
			let split = k.split('.')
			cor = color(split[ 0 ], split[ 1 ], split[ 2 ], 100)
			qtd = linha[ k ]
		}
	}

	if (qtd == 0) cor = cores.preto

	return cor
}

function mudarCores () {
	passos = 0
	colorido = true
	mudarCor = passosMax / (colorido ? 5 : 4)
	corAtual = cores.azul
	procurarBranco = false
	// corLinhaImagem = cores.preto
}

function redesenhar () {
	// apagar desenhos para recomeçar
	blendMode(BLEND)
	background(255)
	image(img, imgX, imgY, larguraImg - diminuirImg * 2, alturaImg - diminuirImg * 2)

	let chaves = Object.keys(TodasLinhas)

	for (i in TodasLinhas[ 0 ]) {
		for (j in chaves) {
			if (i in TodasLinhas[ j ]) TodasLinhas[ j ][ i ].drawDesenho()
		}
	}
}

function mousePressed () {
	context = canvas.getContext('2d')
	data = context.getImageData(mouseX, mouseY, 1, 1).data
	blendMode(BLEND)
	noStroke()
	fill(data[ 0 ], data[ 1 ], data[ 2 ])
	rect(mouseX, mouseY, 10, 10)
}

class Prego {
	constructor(x, y, angulo) {
		this.pos = createVector(x, y)
		this.angulo = angulo
		this.cor = cores.preto
	}

	draw () {
		stroke(this.cor)
		point(this.pos.x + largura / 2, this.pos.y)
	}
}

class Linha {
	constructor(prego1, prego2, cor) {
		this.pos1 = prego1.pos
		this.pos2 = prego2.pos
		this.cor = cor
	}

	draw () {
		line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y)
	}

	drawDesenho () {
		let metade = largura / 2
		stroke(this.cor)
		line(this.pos1.x + metade, this.pos1.y, this.pos2.x + metade, this.pos2.y)
	}
}