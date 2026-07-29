/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.58536585365853, "KoPercent": 13.414634146341463};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });
    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 82, 11, 13.414634146341463, 143.95121951219505, 59, 542, 122.0, 227.3, 311.7499999999999, 542.0, 17.47283187726401, 489.0726131339229, 23.18092604677179], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, 100.0, 86.5, 82, 91, 86.5, 91.0, 91.0, 91.0, 18.18181818181818, 15.340909090909092, 29.518821022727273], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, 50.0, 88.0, 78, 98, 88.0, 98.0, 98.0, 98.0, 8.403361344537815, 14.328387605042018, 12.674796481092438], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 2, 0, 0.0, 148.0, 131, 165, 148.0, 165.0, 165.0, 165.0, 10.362694300518134, 321.68879533678756, 17.74510200777202], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 205.5, 190, 221, 205.5, 221.0, 221.0, 221.0, 6.309148264984227, 8.447111593059937, 3.542734621451104], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 2, 0, 0.0, 231.0, 141, 321, 231.0, 321.0, 321.0, 321.0, 6.230529595015576, 1115.301304517134, 9.762582749221183], "isController": false}, {"data": ["07. POST /admin/api/v1/event/query", 2, 0, 0.0, 306.5, 299, 314, 306.5, 314.0, 314.0, 314.0, 3.3444816053511706, 436.5365018812709, 5.135934887123746], "isController": false}, {"data": ["02. POST /admin/api/v1/state/query", 2, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 3.9840637450199203, 64.71380104581674, 6.118105702191235], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 124.5, 102, 147, 124.5, 147.0, 147.0, 147.0, 7.8431372549019605, 173.422181372549, 12.266390931372548], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 243.0, 220, 266, 243.0, 266.0, 266.0, 266.0, 4.587155963302752, 1024.9269817947247, 9.602117975917432], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 88.5, 59, 118, 88.5, 118.0, 118.0, 118.0, 11.834319526627219, 4.998382026627219, 5.859375], "isController": false}, {"data": ["09. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 5.555555555555555, 130.96516927083334, 8.308919270833334], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 2, 0, 0.0, 109.5, 107, 112, 109.5, 112.0, 112.0, 112.0, 7.604562737642586, 77.6460016634981, 11.95267942015209], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 2, 0, 0.0, 111.0, 108, 114, 111.0, 114.0, 114.0, 114.0, 7.874015748031496, 4.340704970472441, 11.830247293307087], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 2, 0, 0.0, 87.0, 81, 93, 87.0, 93.0, 93.0, 93.0, 9.1324200913242, 298.7032676940639, 14.354130993150685], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, 100.0, 85.5, 82, 89, 85.5, 89.0, 89.0, 89.0, 8.547008547008549, 7.219885149572649, 13.684395032051281], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 100.0, 91, 109, 100.0, 109.0, 109.0, 109.0, 9.1324200913242, 4.485944634703197, 4.42351598173516], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 2, 0, 0.0, 113.0, 105, 121, 113.0, 121.0, 121.0, 121.0, 7.662835249042145, 265.23213002873564, 11.984404932950191], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 164.0, 149, 179, 164.0, 179.0, 179.0, 179.0, 10.582010582010582, 153.26864252645504, 6.541418650793651], "isController": false}, {"data": ["04. POST /admin/api/v1/venue/query", 2, 0, 0.0, 180.5, 179, 182, 180.5, 182.0, 182.0, 182.0, 3.952569169960474, 329.5222949604743, 6.058161437747035], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 102.0, 93, 111, 102.0, 111.0, 111.0, 111.0, 7.547169811320755, 101.4114091981132, 11.633991745283017], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 2, 0, 0.0, 141.5, 122, 161, 141.5, 161.0, 161.0, 161.0, 11.299435028248588, 418.2777189265537, 18.157441737288135], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 2, 0, 0.0, 85.5, 77, 94, 85.5, 94.0, 94.0, 94.0, 9.75609756097561, 139.8580411585366, 15.04858993902439], "isController": false}, {"data": ["06. POST /admin/api/v1/show/query", 2, 0, 0.0, 186.0, 175, 197, 186.0, 197.0, 197.0, 197.0, 4.032258064516129, 5.688082787298387, 6.455944430443548], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 2, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 7.936507936507936, 173.24683779761904, 11.877635168650794], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 89.5, 87, 92, 89.5, 92.0, 92.0, 92.0, 12.987012987012989, 11.008522727272727, 19.740513392857142], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 2, 0, 0.0, 142.5, 136, 149, 142.5, 149.0, 149.0, 149.0, 7.6923076923076925, 243.87770432692307, 11.880258413461538], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 2, 0, 0.0, 127.0, 107, 147, 127.0, 147.0, 147.0, 147.0, 6.514657980456026, 177.8170806188925, 10.10599043159609], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 386.0, 230, 542, 386.0, 542.0, 542.0, 542.0, 2.936857562408223, 2.9239514500734214, 1.4282764317180616], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 117.5, 97, 138, 117.5, 138.0, 138.0, 138.0, 8.474576271186441, 4.990399894067797, 4.55177436440678], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 129.5, 122, 137, 129.5, 137.0, 137.0, 137.0, 8.547008547008549, 8.772369123931623, 5.174946581196581], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, 100.0, 135.5, 93, 178, 135.5, 178.0, 178.0, 178.0, 11.235955056179774, 319.95040379213486, 8.8110077247191], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 133.5, 122, 145, 133.5, 145.0, 145.0, 145.0, 5.5096418732782375, 29.194645316804408, 9.370157541322314], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 136.5, 129, 144, 136.5, 144.0, 144.0, 144.0, 8.333333333333334, 13.997395833333334, 4.060872395833334], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 96.0, 90, 102, 96.0, 102.0, 102.0, 102.0, 14.084507042253522, 10.755941901408452, 6.849691901408451], "isController": false}, {"data": ["01. POST /admin/api/v1/country/query", 2, 0, 0.0, 295.0, 241, 349, 295.0, 349.0, 349.0, 349.0, 2.890173410404624, 11.227646315028903, 4.325381593208093], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 2, 0, 0.0, 92.0, 90, 94, 92.0, 94.0, 94.0, 94.0, 6.802721088435374, 176.19313350340138, 10.207403273809524], "isController": false}, {"data": ["08. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 120.0, 99, 141, 120.0, 141.0, 141.0, 141.0, 5.221932114882507, 156.80585019582244, 8.080226011749348], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 125.5, 105, 146, 125.5, 146.0, 146.0, 146.0, 9.389671361502348, 172.0950704225352, 14.749303110328638], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 2, 0, 0.0, 109.5, 108, 111, 109.5, 111.0, 111.0, 111.0, 15.748031496062993, 22.084153543307085, 24.475578248031496], "isController": false}, {"data": ["05. POST /admin/api/v1/hall/query", 2, 0, 0.0, 125.0, 122, 128, 125.0, 128.0, 128.0, 128.0, 4.4543429844097995, 180.90983435412025, 6.9490360523385295], "isController": false}, {"data": ["03. POST /admin/api/v1/city/query", 2, 0, 0.0, 163.5, 155, 172, 163.5, 172.0, 172.0, 172.0, 4.032258064516129, 133.98595010080646, 6.188177293346774], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 9, 81.81818181818181, 10.975609756097562], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 9.090909090909092, 1.2195121951219512], "isController": false}, {"data": ["403/Forbidden", 1, 9.090909090909092, 1.2195121951219512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 82, 11, "500/Internal Server Error", 9, "422/Unprocessable Entity", 1, "403/Forbidden", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, "500/Internal Server Error", 1, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
