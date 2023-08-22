public with sharing class storeData {
    @AuraEnabled (cacheable=false)
    public static void updateTableData(List<Map<String, Object>> rowsData, Id optId) {
        
       // System.debug('Rows Data: ' + rowsData);

        List<Rent__c> recordsToUpdate = new List<Rent__c>();

        List<Rent__c> recordsToInsert = new List<Rent__c>();
        for (Map<String, Object> rowData : rowsData) {
            Rent__c record = new Rent__c();
            // record.Id = (Id)rowData.get('Id');
            record.ExternalId__c = (String)rowData.get('External');
            record.Initial_Price__c = (Decimal)rowData.get('Initail');
            record.percent_increase__c = (Decimal)rowData.get('Percent');
            record.Opportunity_Name__c	= optId;
            record.Year__c = (String)rowData.get('year');
            // Map other fields here
            recordsToUpdate.add(record);
        }
        System.debug(recordsToUpdate);
        if (!recordsToUpdate.isEmpty()){
        upsert recordsToUpdate ExternalId__c;
        }
    }
}