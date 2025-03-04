var extension = ".ai";
if (app.documents.length > 0)  {
    var folder = Folder(app.activeDocument.path).selectDlg("Select Source Folder...");
}
else {
    var folder = Folder.selectDialog("Select Source Folder...\nHint: Open a document to set default path"); // select folder
}
if (folder==null) {
    alert("Good Bye");
}
else {

    var dlg = new Window("dialog", "Select types to convert to");
    dlg.location = [500, 50];

    dlg.alertBtnsPnl3 = dlg.add('group', undefined, '');
    dlg.eps = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'EPS'); 
    dlg.dxf = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'DXF');
    dlg.pdf = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'PDF'); 
    dlg.svg = dlg.alertBtnsPnl3.add('checkbox', [25,25,235,39], 'SVG'); 
    dlg.eps.value = true; 
    dlg.dxf.value = true; 
    dlg.pdf.value = false;
    dlg.svg.value = false;
    dlg.alertBtnsPnl3.orientation='column';

    dlg.btnPnl = dlg.add('group', undefined, 'Do It!'); 
    dlg.btnPnl.orientation='row';
    dlg.btnPnl.buildBtn1= dlg.btnPnl.add('button',[15,15,115,35], 'OK', {name:'ok'}); 
    dlg.btnPnl.buildBtn1.onClick = dlg.close;

    dlg.show();

    if (!dlg.eps.value && !dlg.dxf.value && !dlg.pdf.value && !dlg.svg.value) {
        alert("No type selected");
    }
    else {
        var files = find_files (folder, [extension]);
        var fileCount = files.length; // count them
        if (fileCount>0) {
            for (i=0; i<fileCount; i++) {
                var idoc = app.open(files[i]);

                if (dlg.eps.value) {
                    // Save as EPS
                    var saveOptsEps = new EPSSaveOptions();
                    saveOptsEps.preview = EPSPreview.TRANSPARENTCOLORTIFF;
                    saveOptsEps.cmykPostScript = true;
                    saveOptsEps.embedAllFonts = true;
                    idoc.saveAs( files[i], saveOptsEps );
                }

                if (dlg.dxf.value) {
                    // Save as DXF
                    var saveOptsDxf = new ExportOptionsAutoCAD();
                    saveOptsDxf.exportFileFormat = AutoCADExportFileFormat.DXF;
                    idoc.exportFile( files[i], ExportType.AUTOCAD, saveOptsDxf);
                }

                if (dlg.svg.value) {
                    // Save as SVG
                    var saveOptsSvg = new ExportOptionsSVG();
                    idoc.exportFile( files[i], ExportType.SVG, saveOptsSvg);
                }

                if (dlg.pdf.value) {
                    // Save as PDF
                    var saveOptsPdf = new PDFSaveOptions();
                    idoc.saveAs( files[i], saveOptsPdf);
                }

                idoc.close();
            }
            alert(fileCount + ' file(s) processed');
        }
        else {
            alert("There are no Illustrator " + extension + " files in this folder.");
        }
    }
}
// recurse subfolders
function find_files (dir, mask_array){
    var arr = [];
    for (var i = 0; i < mask_array.length; i++){
        arr = arr.concat (find_files_sub (dir, [], mask_array[i].toUpperCase()));
    }
    return arr;
}
function find_files_sub (dir, array, mask){
    var f = Folder (dir).getFiles ( '*.*' );
    for (var i = 0; i < f.length; i++){
        if (f[i] instanceof Folder){
            find_files_sub (f[i], array, mask);
        } else if (f[i].name.substr (-mask.length).toUpperCase() == mask){
            array.push (f[i]);
        }
    }
    return array;
}