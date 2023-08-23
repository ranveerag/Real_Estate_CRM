public with sharing class storeData {
    @AuraEnabled (cacheable=false)
    public static void updateTableData(List<Map<String, Object>> rowsData, Id optId) {
        
      // System.debug('rowdata' + rowsData.size());
       List<Opportunity> optDura = [SELECT Lease_Duration_Purchase_Mode__c FROM Opportunity WHERE Id = :optId];
            if (!optDura.isEmpty()) {
                String durationStr = optDura[0].Lease_Duration_Purchase_Mode__c;

                // Convert durationStr to an Integer before comparison
                Integer duration = Integer.valueOf(durationStr);
                //System.debug('duration' + duration);

                if (duration != rowsData.size()) {
                    List<Rent__c> recordsToDelete = [SELECT Id FROM Rent__c WHERE Opportunity_Name__c = :optId];
                    //System.debug('recordtodelete' + recordsToDelete);

                    if (!recordsToDelete.isEmpty()) {
                        delete recordsToDelete;
                    }
                }
    }
        List<Rent__c> recordsToUpdate = new List<Rent__c>();

        //List<Rent__c> recordsToInsert = new List<Rent__c>();
        for (Map<String, Object> rowData : rowsData) {
            Rent__c record = new Rent__c();
            // record.Id = (Id)rowData.get('Id');
            record.ExternalId__c = (String)rowData.get('External');
            record.Initial_Price__c = (Decimal)rowData.get('Initail');
            record.percent_increase__c = (Decimal)rowData.get('Percent');
            record.Rupees_Increase__c = (Decimal)rowData.get('Rupee');
            record.Opportunity_Name__c	= optId;
            record.Year__c = (String)rowData.get('year');
            // Map other fields here
            recordsToUpdate.add(record);
        }
        //System.debug('Duration ' + duration);
        if (!recordsToUpdate.isEmpty()){
        upsert recordsToUpdate ExternalId__c;
        }
    }
}