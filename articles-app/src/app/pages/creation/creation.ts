import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../services/article';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './creation.html',
  styleUrl: './creation.scss'
})
export class Creation {
  article: Article = { id: '', title: '', desc: '', author: '', imgPath: '' };

  constructor(private router: Router, private articleService: ArticleService) {}

  // Envoie du formulaire de création
  sendFormData() {
    this.articleService.save(this.article).subscribe({
      next: () => {
        alert('Article créé avec succès !');
        this.router.navigate(['/liste-articles']);
      },
      error: (err) => console.error('Erreur lors de la création de l’article', err)
    });
  }

  // Annuler et revenir à la liste
  annuler() {
    this.router.navigate(['/liste-articles']);
  }
}
