import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

// Classe user pour ce formulaire
export class User {
  public email: string = "";
  public password: string = "";
}

@Component({
  selector: 'app-connexion',
  imports: [FormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss'
})
export class Connexion {
  public user : User = new User();

  constructor(private router: Router) {}

  // Vérifie email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  // Soumission du formulaire
  sendFormData(){
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return;
    }
    if (!this.user.password.trim()) {
      alert("Le mot de passe ne peut pas être vide");
      return;
    }

    // Stocke l'état connecté
    localStorage.setItem('connected', 'true');

    // Redirection vers liste articles
    this.router.navigate(['/liste-articles']);
  }

  // Redirection vers mot de passe oublié
  mdp() {
    this.router.navigate(['/password']);
  }
}
