import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

// Classe user simplifiée pour ce formulaire
export class User {
  public email: string = "";
  public pseudo: string = "";
}

@Component({
  selector: 'app-mdp',
  imports: [FormsModule],
  templateUrl: './mdp.html',
  styleUrl: './mdp.scss'
})
export class Mdp {
  public user : User = new User();

  constructor(private router: Router) {} // injecte le router

  // Vérifie le format de l'email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  // Envoi du formulaire
  sendFormData(){
    // Vérifie le format de l'email
    if (!this.isValidEmail(this.user.email)) {
      alert("Veuillez entrer une adresse email valide (exemple : nom@domaine.com)");
      return; // stop si email invalide
    }

    // Affiche un message de confirmation
    alert("Email de réinitialisation du mots de passe envoyé");
  }
}
