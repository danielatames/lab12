package com.techconf.controllers;

import com.techconf.models.Asistente;
import com.techconf.models.Charla;
import com.techconf.repositories.CharlaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/charlas")
@CrossOrigin(origins = "http://localhost:4200")
public class CharlaController {

    @Autowired
    private CharlaRepository repository;

    @GetMapping
    public List<Charla> obtenerTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Charla registrarCharla(@RequestBody Charla nuevaCharla) {
        return repository.save(nuevaCharla);
    }

    @PostMapping("/{id}/asistentes")
    @Transactional
    public ResponseEntity<Charla> inscribirAsistente(@PathVariable Long id,
                                                     @Valid @RequestBody Asistente asistente) {
        Charla charla = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Charla no encontrada"));
        asistente.setId(null);
        charla.addAsistente(asistente);
        Charla guardada = repository.save(charla);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }
}