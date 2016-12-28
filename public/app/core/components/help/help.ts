///<reference path="../../../headers/common.d.ts" />

import coreModule from '../../core_module';
import appEvents from 'app/core/app_events';

export class HelpCtrl {
  tabIndex: any;
  shortcuts: any;

  /** @ngInject */
  constructor(private $scope, $sce) {
    this.tabIndex = 0;
    this.shortcuts = {
      'Глобальные команды': [
        {keys: ['g', 'h'], description: 'Перейти к главной панели'},
        {keys: ['g', 'p'], description: 'Перейти в профиль'},
        {keys: ['s', 'o'], description: 'Открыть поиск'},
        {keys: ['s', 's'], description: 'Открыть поиск по "Избранным"'},
        {keys: ['s', 't'], description: 'Открыть поиск по Тегам'},
        {keys: ['esc'], description: 'Закрыть окно редактирования/настроек'},
      ],
      'Команды панели': [
        {keys: ['mod+s'], description: 'Сохранить панель'},
        {keys: ['mod+h'], description: 'Скрыть команды управления для строки'},
        {keys: ['d', 'r'], description: 'Обновить все панели'},
        {keys: ['d', 's'], description: 'Настройки панели'},
        {keys: ['d', 'v'], description: 'Переключить в активный режим'},
        {keys: ['d', 'k'], description: 'Скрыть верхнюю строки управления'}/*,
        {keys: ['mod+o'], description: 'Toggle shared graph crosshair'},*/
      ],
      'Команды активной панели': [
        {keys: ['e'], description: 'Переключить в режим редактирования'},
        {keys: ['v'], description: 'Переключить в полноэкранный режим просмотра'},
        {keys: ['p', 's'], description: 'Открыть окно для создания ссылки на панель'},
        {keys: ['p', 'r'], description: 'Удалить панель'},
      ],
      'Команды активной строки': [
        {keys: ['r', 'c'], description: 'Свернуть'},
        {keys: ['r', 'r'], description: 'Удалить'},
      ],
      'Команды для управления временным интервалом': [
        {keys: ['t', 'z'], description: 'Уменьшить интервал'},
        {keys: ['t', '<i class="fa fa-long-arrow-left"></i>'], description: 'Просмотреть раньше'},
        {keys: ['t', '<i class="fa fa-long-arrow-right"></i>'], description: 'Просмотреть позже'},
      ],
    };
  }

  dismiss() {
    appEvents.emit('hide-modal');
  }
}

export function helpModal() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/help/help.html',
    controller: HelpCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {},
  };
}

coreModule.directive('helpModal', helpModal);
