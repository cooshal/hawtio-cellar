/// <reference path="./threads.service.ts"/>

namespace Runtime {

  export function ThreadsController(
    $scope,
    $uibModal: angular.ui.bootstrap.IModalService,
    threadsService: ThreadsService) {
    'ngInject';

    const FILTER_FUNCTIONS = {
      state: (threads, state) => threads.filter(thread => thread.threadState === state),
      name: (threads, name) => {
        var re = new RegExp(name, 'i');
        return threads.filter(thread => re.test(thread.threadName));
      }
    };

    let allThreads;

    $scope.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'state',
            title:  'State',
            placeholder: 'Filter by state...',
            filterType: 'select',
            filterValues: ['Blocked', 'New', 'Runnable', 'Terminated', 'Timed waiting', 'Waiting']
          },
          {
            id: 'name',
            title: 'Name',
            placeholder: 'Filter by name...',
            filterType: 'text'
          }
        ],
        onFilterChange: filterChange
      },
      isTableView: true
    };

    $scope.tableConfig = {
      selectionMatchProp: 'threadId',
      showCheckboxes: false
    };

    $scope.tableDtOptions = {
      order: [[0, "desc"]]
    };

    $scope.tableColumns = [
      {
        header: 'ID',
        itemField: 'threadId'
      },
      {
        header: 'State',
        itemField: 'threadState'
      },
      {
        header: 'Name',
        itemField: 'threadName',
        templateFn: value => `<span class="table-cell-truncated" title="${value}">${value}</span>`
      },
      {
        header: 'Waited Time',
        itemField: 'waitedTime'
      },
      {
        header: 'Blocked Time',
        itemField: 'blockedTime'
      },
      {
        header: 'Native',
        itemField: 'inNative',
        templateFn: value => value ? '<span class="fa fa-circle" aria-hidden="true"></span>' : ''
      },
      {
        header: 'Suspended',
        itemField: 'suspended',
        templateFn: value => value ? '<span class="fa fa-circle" aria-hidden="true"></span>' : ''
      }
    ];

    $scope.tableItems = null;

    $scope.tableActionButtons = [
      {
        name: 'More',
        title: 'View more information about this thread',
        actionFn: viewDetails
      }
    ];

    (function init() {
      loadThreads();
    })();

    function loadThreads() {
      threadsService.getThreads().then(threads => {
        allThreads = threads;
        $scope.filteredThreads = threads;
        updateResultCount();
      });
    }

    function filterChange(filters: any[]) {
      applyFilters(filters);
      updateResultCount();
    }

    function applyFilters(filters: any[]) {
      let filteredThreads = allThreads;
      filters.forEach(filter => {
        filteredThreads = FILTER_FUNCTIONS[filter.id](filteredThreads, filter.value);
      });
      $scope.filteredThreads = filteredThreads;
    }

    function updateResultCount() {
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.filteredThreads.length;
    }

    function viewDetails(action, item) {
      $scope.thread = _.find($scope.filteredThreads, thread => thread.threadId === item.threadId);
      openModal();
    }

    function openModal() {
      $uibModal.open({
        templateUrl: 'threadModalContent.html',
        scope: $scope,
        size: 'lg'
      });
    }

  }

}
