import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

// Classe utilisateur pour ce formulaire
export class User {
  public email: string = "";
  public password: string = "";
}

@Component({
  selector: 'app-inscription',
  imports: [FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss'
})
export class Inscription {
  public user : User = new User();
  public confirmPassword: string = ""; // confirmation du mot de passe

  constructor(private router: Router) {}

  // Vérifie que l'email est au bon format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Envoi du formulaire d'inscription
  sendFormData(){
    // Vérification email
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return;
    }

    // Vérification mots de passe identiques
    if (this.user.password !== this.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // Stocke état de connexion pour message liste-articles
    localStorage.setItem('connected', 'true');

    // Redirection vers la liste des articles
    this.router.navigate(['/liste-articles']);
  }
}
