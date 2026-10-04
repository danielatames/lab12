import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CharlaService, Charla, Asistente } from '../../services/charla.service';
import { validarRangoFechas, mayorDe18 } from '../../validators/validadores';

@Component({
  selector: 'app-charla-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './charla-registro.component.html',
  styleUrl: './charla-registro.component.css'
})
export class CharlaRegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private charlaService = inject(CharlaService);

  charlas = signal<Charla[]>([]);
  mensajeExito = signal('');
  charlaAbiertaId = signal<number | null>(null);

  registroForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    expositor: ['', [Validators.required]],
    nivel: ['Principiante', [Validators.required]],
    emailContacto: ['', [Validators.required, Validators.email]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    etiquetas: this.fb.nonNullable.array([
      this.fb.nonNullable.control('', Validators.required)
    ])
  }, { validators: validarRangoFechas });

  
  asistenteForm = this.fb.nonNullable.group({
    asistente: this.fb.nonNullable.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      edad: new FormControl<number | null>(null, [Validators.required, mayorDe18])
    })
  });

  ngOnInit(): void {
    this.cargarCharlas();
  }

  // ---- Getters ----
  get tituloCtrl() { return this.registroForm.controls.titulo; }
  get expositorCtrl() { return this.registroForm.controls.expositor; }
  get emailCtrl() { return this.registroForm.controls.emailContacto; }
  get etiquetasArray() { return this.registroForm.controls.etiquetas; }
  get a() { return this.asistenteForm.controls.asistente.controls; }

  
  cargarCharlas() {
    this.charlaService.getCharlas().subscribe({
      next: (data) => this.charlas.set(data),
      error: (err) => console.error('Error al cargar las charlas', err)
    });
  }

  agregarEtiqueta() {
    this.etiquetasArray.push(this.fb.nonNullable.control('', Validators.required));
  }

  removerEtiqueta(index: number) {
    if (this.etiquetasArray.length > 1) {
      this.etiquetasArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    const v = this.registroForm.getRawValue();
    const nueva: Charla = {
      titulo: v.titulo,
      expositor: v.expositor,
      nivel: v.nivel,
      emailContacto: v.emailContacto,
      fechaInicio: v.fechaInicio,
      fechaFin: v.fechaFin,
      etiquetas: v.etiquetas.filter(e => e.trim() !== '')
    };

    this.charlaService.registrarCharla(nueva).subscribe({
      next: (res) => {
        this.mensajeExito.set('¡Charla registrada exitosamente!');
        this.charlas.update(lista => [...lista, res]);
        this.etiquetasArray.clear();
        this.agregarEtiqueta();
        this.registroForm.reset({ nivel: 'Principiante' });
      },
      error: (err) => console.error(err)
    });
  }

  toggleFormAsistente(id: number) {
    this.asistenteForm.reset();
    this.charlaAbiertaId.set(this.charlaAbiertaId() === id ? null : id);
  }

  inscribir(charla: Charla) {
    if (this.asistenteForm.invalid) {
      this.asistenteForm.markAllAsTouched();
      return;
    }
    const v = this.asistenteForm.getRawValue().asistente;
    const body: Asistente = {
      nombreCompleto: v.nombre,
      correo: v.correo,
      edad: v.edad!
    };

    this.charlaService.inscribirAsistente(charla.id!, body).subscribe({
      next: (actualizada) => {
        this.charlas.update(lista => lista.map(c => c.id === actualizada.id ? actualizada : c));
        this.charlaAbiertaId.set(null);
        this.asistenteForm.reset();
      },
      error: (err) => console.error(err)
    });
  }
}