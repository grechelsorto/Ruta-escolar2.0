const STORAGE_KEY = "ruta_escolar_alumnos";

let alumnos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const rosterList = document.getElementById("rosterList");
const emptyMsg = document.getElementById("emptyMsg");
const modalOverlay = document.getElementById("modalOverlay");
const studentForm = document.getElementById("studentForm");

document.getElementById("openFormBtn").addEventListener("click", () => {
  modalOverlay.classList.add("open");
});
document.getElementById("closeFormBtn").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("open");
  studentForm.reset();
}

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    id: Date.now().toString(),
    nombre: document.getElementById("fName").value.trim(),
    grado: document.getElementById("fGrade").value.trim(),
    hora: document.getElementById("fTime").value,
    direccion: document.getElementById("fAddress").value.trim(),
    maestra: document.getElementById("fTeacher").value.trim(),
    telefono: document.getElementById("fPhone").value.trim(),
    estado: null // null | "presente" | "excusa" | "falta"
  };
  alumnos.push(nuevo);
  guardar();
  render();
  closeModal();
});

function marcar(id, estado) {
  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) return;
  alumno.estado = alumno.estado === estado ? null : estado;
  guardar();
  render();
}

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
}

function render() {
  rosterList.innerHTML = "";

  emptyMsg.style.display = alumnos.length === 0 ? "block" : "none";

  alumnos.forEach(a => {
    const li = document.createElement("li");
    li.className = `roster-item ${a.estado || ""}`;

    li.innerHTML = `
      <div class="item-info">
        <span class="item-name">${a.nombre}</span>
        <span class="item-meta">
          <span>${a.grado}</span>
          <span>Maestra: ${a.maestra}</span>
          <span>${a.direccion}</span>
        </span>
        <span class="item-time">Recogida: ${a.hora || "--:--"} · Tel. padre/madre: ${a.telefono}</span>
      </div>
      <div class="item-actions">
        <button class="mark-btn ${a.estado === "presente" ? "active-presente" : ""}" data-estado="presente">Presente</button>
        <button class="mark-btn ${a.estado === "excusa" ? "active-excusa" : ""}" data-estado="excusa">Excusa</button>
        <button class="mark-btn ${a.estado === "falta" ? "active-falta" : ""}" data-estado="falta">Falta</button>
      </div>
    `;

    li.querySelectorAll(".mark-btn").forEach(btn => {
      btn.addEventListener("click", () => marcar(a.id, btn.dataset.estado));
    });

    rosterList.appendChild(li);
  });

  actualizarStats();
}

function actualizarStats() {
  const presentes = alumnos.filter(a => a.estado === "presente").length;
  const excusas = alumnos.filter(a => a.estado === "excusa").length;
  const faltas = alumnos.filter(a => a.estado === "falta").length;
  const pendientes = alumnos.filter(a => !a.estado).length;

  document.getElementById("countPresente").textContent = presentes;
  document.getElementById("countExcusa").textContent = excusas;
  document.getElementById("countFalta").textContent = faltas;
  document.getElementById("countPendiente").textContent = pendientes;
}

function mostrarFecha() {
  const hoy = new Date();
  const texto = hoy.toLocaleDateString("es-HN", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("dateBox").textContent = texto;
}

mostrarFecha();
render();
