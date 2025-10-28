import { Component } from '@angular/core';
import {NgStyle} from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-article',
  imports: [NgStyle],
  templateUrl: './detail-article.html',
  styleUrls: ['./detail-article.scss']
})
export class DetailArticle {
  articleId: string | null = null;
  article: any = null; // ou Article si interface définie

  // Simule une DB locale pour les tests
  public DB_Articles = [
    { id: '1', title: 'Premier article', desc: 'Contenu du premier article', author: 'Isaac', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
    { id: '2', title: 'Deuxième article', desc: 'Contenu du deuxième article', author: 'Sanchez', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' },
    { id: '3', title: 'Troisième article', desc: 'Contenu du troisième article', author: 'Toto', imgPath: 'https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-653001154-e1691965000531.jpg' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Récupère l'id passé dans l'URL
    this.articleId = this.route.snapshot.paramMap.get('id');

    // Cherche l'article correspondant
    if (this.articleId) {
      this.article = this.DB_Articles.find(a => a.id === this.articleId);
    }
  }
}
