class Motor {
  constructor(n_n, n_s, Jrm, R1, m1, m2_vk, c1, c2, k1, k2, k3, t, I, Mm, Mt) {
    this.n_n = n_n;
    this.n_s = n_s;
    this.s_n = (n_s - n_n) / n_s;
    this.Jrm = Jrm;
    this.R1 = R1;
    this.m1 = m1;
    this.m2_vk = m2_vk;
    this.c1 = c1;
    this.c2 = c2;
    this.k1 = k1;
    this.k2 = k2;
    this.k3 = k3;
    this.t = t;
    this.I = I;
    this.Mm = Mm;
    this.Mt = Mt;
  }

  vrijeme_pokretenja_EMP(Jt, M) {
    return (((Jt + this.Jrm) * this.n_s) / 9.55) * (1 / M) * (1 - this.s_n);
  }

  gubici_u_bakru_statora(Jt, M) {
    return (
      ((((3 * this.R1 * ((Jt + this.Jrm) * this.n_s)) / 9.55) *
        (this.I * this.I)) /
        M) *
      (1 - this.s_n)
    );
  }

  nadtemperatura_statorskog_namotaja(Acu1) {
    return (Acu1 * this.k1) / (this.m1 * this.c1);
  }

  temperatura_namotaja_statora(t) {
    return t + this.t;
  }

  gubici_u_bakru_rotora(Jt, M) {
    return (
      (((Jt + this.Jrm) * (this.n_s * this.n_s)) / 91.2) *
      (this.Mm / (M * 2)) *
      (1 - this.s_n * this.s_n)
    );
  }

  nadtemperatura_bakra_vanjskog_kaveza(Acu2) {
    return (Acu2 * this.k2 * this.k3) / (this.m2_vk * this.c2);
  }

  temperatura_vanjskog_kaveza(t) {
    return t + this.t;
  }
}

const n_n = document.getElementById("n_n").value;
const n_s = document.getElementById("n_s").value;
const Jrm = document.getElementById("Jrm").value;
const R1 = document.getElementById("R1").value;
const m1 = document.getElementById("m1").value;
const m2_vk = document.getElementById("m2_vk").value;
const c1 = document.getElementById("c1").value;
const c2 = document.getElementById("c2").value;
const k1 = document.getElementById("k1").value;
const k2 = document.getElementById("k2").value;
const k3 = document.getElementById("k3").value;
const t = document.getElementById("t").value;
const Jt = document.getElementById("Jt").value;
const I = document.getElementById("I").value;
const Mm = document.getElementById("Mm").value;
const Mt = document.getElementById("Mt").value;
const output = document.getElementById("output");
const submitButton = document.getElementById("submit");

function razlika_momenata(moment_motora, moment_tereta) {
  return moment_motora - moment_tereta;
}

const motor = new Motor(
  (n_n = parseFloat(n_n)),
  (n_s = parseFloat(n_s)),
  (Jrm = parseFloat(Jrm)),
  (R1 = parseFloat(R1)),
  (m1 = parseFloat(m1)),
  (m2_vk = parseFloat(m2_vk)),
  (c1 = parseFloat(c1)),
  (c2 = parseFloat(c2)),
  (k1 = parseFloat(k1)),
  (k2 = parseFloat(k2)),
  (k3 = parseFloat(k3)),
  (t = parseFloat(t)),
  (I = parseFloat(I)),
  (Mm = parseFloat(Mm)),
  (Mt = parseFloat(Mt))
);

var razlika_momenata_Mm_Mt = razlika_momenata(motor.Mm, motor.Mt);

var vrijeme_pokretanja = motor.vrijeme_pokretenja_EMP(
  Jt,
  razlika_momenata_Mm_Mt
);

var gubici_u_bakru_statora = motor.gubici_u_bakru_statora(
  Jt,
  razlika_momenata_Mm_Mt
);

var nadtemperatura_statorskog_namotaja =
  motor.nadtemperatura_statorskog_namotaja(gubici_u_bakru_statora);

var temperatura_namotaja_statora = motor.temperatura_namotaja_statora(
  nadtemperatura_statorskog_namotaja
);

var gubici_u_bakru_rotora = motor.gubici_u_bakru_rotora(
  Jt,
  razlika_momenata_Mm_Mt
);

var nadtemperatura_bakra_vanjskog_kaveza =
  motor.nadtemperatura_bakra_vanjskog_kaveza(gubici_u_bakru_rotora);

var temperatura_vanjskog_kaveza = motor.temperatura_vanjskog_kaveza(
  nadtemperatura_bakra_vanjskog_kaveza
);

function display() {
  return `Vrijeme pokretanja = ${vrijeme_pokretanja} s
  Gubici u bakru rotora = ${gubici_u_bakru_rotora} kJ
  Gubici u bakru statora = ${gubici_u_bakru_statora} kJ
  Temperatura vanjskog kaveza = ${temperatura_vanjskog_kaveza} °C
  Temperatura namotaja statora = ${temperatura_namotaja_statora} °C
  Nadtemperatura statorskog namotaja = ${nadtemperatura_statorskog_namotaja} °C
  Nadtemperatura bakra vanjskog kaveza = ${nadtemperatura_bakra_vanjskog_kaveza} °C`;
}

function load() {
  document.getElementById("output").innerText = display();
}
