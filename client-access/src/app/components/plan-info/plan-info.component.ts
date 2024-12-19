import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { differenceInDays, isPast, parseISO } from 'date-fns';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-plan-info',
  standalone: true,
  templateUrl: './plan-info.component.html',
  styleUrls: ['./plan-info.component.scss'],
  imports: [NgIf, NgClass, AsyncPipe, RouterLink],
})
export class PlanInfoComponent {
  planType: 'free' | 'light' | 'gold' | 'platinum' = 'free'; // Tipo de plan actual

  remainingDays$ = this.authService.currentClient$.pipe(
    map((client) => {
      if (
        !client ||
        !client.expirationDate ||
        isPast(parseISO(client.expirationDate))
      ) {
        return 0;
      }
      return differenceInDays(parseISO(client.expirationDate), new Date());
    })
  );

  constructor(private authService: AuthService) {}

  formatPlan(plan: 'free' | 'light' | 'gold' | 'platinum'): string {
    const plans = {
      free: 'Plan Free',
      light: 'Plan Light',
      gold: 'Plan Gold',
      platinum: 'Plan Platinum',
    };
    return plans[plan] || 'Plan Desconocido';
  }
}
