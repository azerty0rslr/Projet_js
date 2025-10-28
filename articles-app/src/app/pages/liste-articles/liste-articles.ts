import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ArticleService, Article } from '../../services/article';

@Component({
  selector: 'app-liste-articles',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle], // directives utilisées dans le template
  templateUrl: './liste-articles.html',
  styleUrl: './liste-articles.scss'
})
export class ListeArticles {
  public connected = false; // affiche le message de connexion
  public DB_Articles: Article[] = []; // liste des articles récupérés du back

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    // Vérifie si l'utilisateur vient de se connecter
    if (localStorage.getItem('connected') === 'true') {
      this.connected = true;
      setTimeout(() => {
        this.connected = false;
        localStorage.removeItem('connected'); // supprime le flag
      }, 3000);
    }

    this.loadArticles(); // charge les articles au démarrage
  }

  // Charger la liste des articles depuis le service
  loadArticles() {
    this.articleService.getAll().subscribe({
      next: (res: any) => {
        // back renvoie { data: [...] }
        if (res && res.data && Array.isArray(res.data)) {
          this.DB_Articles = res.data;
        }
        // back renvoie directement un tableau
        else if (Array.isArray(res)) {
          this.DB_Articles = res;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles :', err);
        this.DB_Articles = [];
      }
    });
  }

  // Navigation vers modification d'article
  modifier(articleId: string) {
    this.router.navigate(['/ajout-modif', articleId]);
  }

  // Supprimer un article avec confirmation
  supprimer(articleId: string) {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.articleService.delete(articleId).subscribe({
        next: () => {
          alert('Article supprimé avec succès !');
          this.loadArticles(); // recharge la liste
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  // Affiche le détail de l'article
  detail(articleId: string) {
    this.router.navigate(['/detail-article', articleId]);
  }

  // Navigation vers création
  creation() {
    this.router.navigate(['/creation']);
  }

  // Navigation vers connexion
  connexion() {
    this.router.navigate(['/connexion']);
  }

  // Navigation vers inscription
  inscription() {
    this.router.navigate(['/inscription']);
  }
}
