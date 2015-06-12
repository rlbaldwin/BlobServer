var azureTable = require('azure-table-node')
  
//set azure storage credentials
azureTable.setDefaultClient({
    accountUrl: 'http://[accountName].table.core.windows.net/',
    accountName: '[accountName]',
    accountKey: '[accountKey]'
});