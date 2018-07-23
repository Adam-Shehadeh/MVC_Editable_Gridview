/*
Author:     Adam Shehadeh
Date:       7/17/2018
Desc:       This file is a script to implement an editable gridview that's somewhat reusable.
            Matches editor seen in FreightBill application
*/

var load_url, add_url, update_url, delete_url, list_selector_id, table_id, paginator_id, pagesizeddl_id;

var rowState = {
    MAKE_ROW: -2,
    NEW_ROW: -1,
    DISPLAY: 0,
    EDIT_EXISTING: 1
};

function initializeEditableGridview(params) {
    load_url = params.Load;
    add_url = params.Add;
    update_url = params.Update;
    delete_url = params.Delete;
    list_selector_id = params.ListSelector;
    table_id = params.TableId;
    paginator_id = params.PaginatorId;
    pagesizeddl_id = params.PageSizeDDLId;

    load();
    $(list_selector_id).change(function () {
        load();
    });
}

function newMakeRow() {
    //First, remove all newrowrows from table so we can only have 1. (gets weird with paging otherwise)
    $.each($('tr[data-edit="' + rowState.MAKE_ROW + '"]'), function (index, item) {
        $(item).remove();
    });

    var rowstr = ''; 
    rowstr += '<tr data-edit="' + rowState.MAKE_ROW + '">';
    rowstr += '<td></td>';
    rowstr += '<td></td>';
    rowstr += '<td></td>';
    rowstr += '<td style="text-align:left">';
    rowstr += '<img src="/EditableGridview/Images/add1.png" class="plus_ico" onclick="newNewRow(this);" />';
    rowstr += '</td>';
    rowstr += '</tr>';
    $(table_id + ' > tbody').append(rowstr);
}
function newNewRow(self) {
    $.each($('tr[data-edit="' + rowState.MAKE_ROW + '"]'), function (index, item) {
        $(item).remove();
    });
    $.each($('tr[data-edit="' + rowState.NEW_ROW + '"]'), function (index, item) {
        $(item).remove();
    });
    var rowstr = '';

    rowstr += '<tr data-edit="' + rowState.NEW_ROW + '">';
    rowstr += '<td><input class="inp_txt hero_txt" /></td>';
    rowstr += '<td><input class="inp_txt type_txt" /></td>';
    rowstr += '<td><input class="inp_txt faction_txt" /></td>';
    rowstr += '<td>';
    rowstr += '<img src="/EditableGridview/Images/save1.png" class="save_ico" onclick="saveRow(this);" />';
    rowstr += '<img src="/EditableGridview/Images/edit1.png.png" class="edit_ico" style="display:none;" onclick="editRow(this);" />';
    rowstr += '<img src="/EditableGridview/Images/x1.png" class="delete_ico" onclick="deleteRow(this);" />';
    rowstr += '</td>';
    rowstr += '</tr>';
    $(table_id + '>tbody').append(rowstr);
}

function load() {
    var lst = $(list_selector_id).val();
    $(table_id + '>tbody').html('')
    $.ajax({
        cache: false,
        url: load_url,
        data: { listnm: lst },
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (index, item) {
                html += '<tr data-edit="0" data-id="' + item.ID + '">';
                html += '<td><label class="disp_lbl hero_lbl">' + item.Hero + '</label><input style="display:none;" class="inp_txt hero_txt" value="' + item.Hero + '"/></td>';
                html += '<td><label class="disp_lbl type_lbl">' + item.Type + '</label><input style="display:none;" class="inp_txt type_txt" value="' + item.Type + '" /></td>';
                html += '<td><label class="disp_lbl faction_lbl">' + item.Faction + '</label><input style="display:none;" class="inp_txt faction_txt" value="' + item.Faction + '" /></td>';
                html += "<td>";
                html += '<img src="/EditableGridview/Images/save1.png" class="save_ico" style="display:none;" onclick="saveRow(this);" />';
                html += '<img src="/EditableGridview/Images/edit1.png" class="edit_ico" onclick="editRow(this);" />';
                html += '<img src="/EditableGridview/Images/x1.png" class="delete_ico" onclick="deleteRow(this);" />';
                html += "</td>";
                html += "</tr>";
            });
            $(table_id + '>tbody').html(html);
            $.each($('tr[data-edit="' + rowState.MAKE_ROW + '"]'), function (index, item) {
                $(item).remove();
            });
            $.each($('tr[data-edit="' + rowState.NEW_ROW + '"]'), function (index, item) {
                $(item).remove();
            });
            generatePages();
            //newMakeRow();
        },
        error: function (xhr, status, errormessage) {
            $('#_modal').find(".modal-body").text(errormessage);
            $('#_modal').modal('show');
        }
    });
}
function editRow(self) {
    var row = $(self).closest('tr');

    $.each($(row).find('.disp_lbl'), function (index, item) {
        $(item).css('display', 'none');
    });
    $.each($(row).find('.inp_txt'), function (index, item) {
        $(item).css('display', 'block');
    });

    $(row).attr('data-edit', '1')
    $(row).find('.edit_ico').hide();
    $(row).find('.save_ico').show();
}

function saveRow(self) {
    var row = $(self).closest('tr');
    var model = {
        ID: "-1",
        Hero: $(row).find('.hero_txt').val(),
        Type: $(row).find('.type_txt').val(),
        Faction: $(row).find('.faction_txt').val()
    }
    if ($(row).attr('data-edit') == rowState.NEW_ROW){
        $.ajax({
            cache: false,
            url: "/Home/Add",
            data: { dataStr: JSON.stringify(model) },
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                load();
                alert('Successfully added row! ' + JSON.stringify(model));
            },
            error: function (xhr, status, errormessage) {
                alert(errormessage);
            }
        });
    }
}

function deleteRow(self){
    var row = $(self).closest('tr');
    var id = row.attr('data-id');
    if (row.attr('data-edit') == rowState.DISPLAY) {
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                cache: false,
                url: "/Home/Delete",
                data: { id: id },
                type: "GET",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    load();
                    alert('Deleted row!');

                },
                error: function (xhr, status, errormessage) {
                    alert(errormessage);
                }
            });
        }
    } else if (row.attr('data-edit') == rowState.EDIT_EXISTING) {
        $.each($(row).find('.disp_lbl'), function (index, item) {
            $(item).css('display', 'block');
        });
        $.each($(row).find('.inp_txt'), function (index, item) {
            $(item).css('display', 'none');
        });
        $(row).attr('data-edit', rowState.DISPLAY);
        $(row).find('.edit_ico').show();
        $(row).find('.save_ico').hide();
    } else if (row.attr('data-edit') == rowState.NEW_ROW) {
        $(row).remove();
        newMakeRow();
    }
}

function update() {
    $.ajax({
        cache: false,
        url: "/Settings/GetItemDropDownList",
        data: { listnm: lst },
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.success == 0) {

            } else if (result.success == 1) {
                redirectError();
            }
        },
        error: function (xhr, status, errormessage) {
            $('#_modal').find(".modal-body").text(errormessage);
            $('#_modal').modal('show');
        }
    });
}


var pageNum = 1;

function generatePages() {
    pg();
    $(pagesizeddl_id).on('change', function () {
        $.each($('tr[data-edit="'+rowState.MAKE_ROW+'"]'), function (index, item) {
            $(item).remove();
        });
        generatePages();

    });
    $('.sortable_header').on('click', function () {
        $('.sortable_header').removeClass('selected_sortable_header');
        $(this).addClass('selected_sortable_header');
    });

}

function pg() {
    var table, paginator, pagesizeddl;
    table = $(table_id);
    paginator = $(paginator_id);
    pagesizeddl = $(pagesizeddl_id);
    paginator.html('');
    var trnum = 0;
    var maxRows = pagesizeddl.val();
    var totalRows = table.find('tbody tr').length;
    table.find('tr:gt(0)').each(function () {
        trnum++;
        if (trnum > maxRows) {
            $(this).hide();
        }
        if (trnum <= maxRows) {
            $(this).show();
        }
    });
    if (totalRows > maxRows) {
        var pagenum = Math.ceil(totalRows / maxRows);
        for (var i = 1; i <= pagenum ;) {
            paginator.append('<a class="page-num" data-page="' + i + '">\
					      <span>' + i++ + '</span>\
					    </a>').show();
        }
    }
    paginator.find('a:first-child').addClass('selected-page');
    paginator.find('a').on('click', function () {
        pageNum = $(this).attr('data-page');
        var trIndex = 0;
        paginator.find('a').removeClass('selected-page');
        $(this).addClass('selected-page');
        table.find('tr:gt(0)').each(function () {
            trIndex++;
            if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
        newMakeRow();
    });
    if (totalRows <= pagesizeddl.children(0).val()) {
        pagesizeddl.hide();
    } else {
        pagesizeddl.show();
    }
    //Restores headers to look normal 
    $.each($('.sortable_header'), function (index, item) {
        $(item).removeClass('selected_sortable_header');
    });
    newMakeRow();
}



function sortTable(n, compare_type) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(table_id.replace('#', ''));
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1) ; i++) {
            shouldSwitch = false;
            x = $(rows[i]).find('.disp_lbl').html();
            y = $(rows[i + 1]).find('.disp_lbl').html();

            var x_compare = "";
            var y_compare = "";
            if (compare_type == "INT") {
                x_compare = parseInt(x);
                y_compare = parseInt(y);
            }
            else if (compare_type = "STR") {
                x_compare = x;
                y_compare = y;
            }

            if (dir == "asc") {
                if (x_compare > y_compare) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x_compare < y_compare) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            //alert($(rows[i + 1]).find('.disp_lbl').html() + "||||" + $(rows[i]).find('.disp_lbl').html());
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    pg();
    $('.pagination a:nth-child(' + pageNum + ')').trigger('click');	//clicks to current page
}