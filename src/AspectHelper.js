import { getActor } from "./ui.js";

const renderAspectHelper = () => {

    const renderAspects = (aspects) => {
        let rows = "";
        let index = 0;
        for (let aspectName in aspects) {
            let a = aspects[aspectName];
            rows += `<tr>
            <td>${a.name}</td>
            <td style='text-align:center'  id='col_${index}'>${a.free_invokes}</td>
            <td style='text-align:center'>
                <button id='inc_${index}' data-name="${aspectName}" style="width:auto" class="increment_btn" >+</button>
                <button id='dec_${index}' data-name="${aspectName}" style="width:auto" class="decrement_btn">-</button>
                <button id='del_${index}' data-name="${aspectName}" style="width:auto" class="delete_btn"><i class="fa fa-trash" aria-hidden="true"></i></button>
            </td>
        </tr>
        `;
            index++;
        }
        return rows;
    }

    let actor = getActor();
    console.log(actor.system);
    // display all situational aspects 
    if (actor) {
        if (!actor.system.situational_aspects || Array.isArray(actor.system.situational_aspects)) {
            actor.system.situational_aspects = {};
        }

        let aspects = duplicate(actor.system.situational_aspects);
        let content = `
                <div style="min-height:500px">                
                    <h1>Situation Aspect Manager</h1>
                    <div class="flexrow">                        
                        <input type="text" id="new-aspect-name" class="flex3" style="margin-top:2px" />
                        <button id="add-new-aspect" class="flex1">New</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Free Invokes</th>
                                <th>&nbsp;</th>
                            </tr>            
                        </thead>
                        <tbody id="aspect-body">     
                        ${renderAspects(aspects)}
                        </tbody>
                    </table>
                </div>`

        new Dialog({
            'content': content,
            'title': 'Situation Aspects Manager',
            'render': function () {

             
              
                document.querySelector("#add-new-aspect").addEventListener("click", (event) => {
                    let name = document.querySelector("#new-aspect-name").value;
                    let key = name;
                    if (key) {
                        if (!aspects[key]) {
                            aspects[key] = {
                                name: name,
                                free_invokes: 0
                            };
                            document.querySelector("#aspect-body").innerHTML = renderAspects(aspects);
                            document.querySelector("#new-aspect-name").value = "";
                            document.querySelector("#new-aspect-name").focus();                        
                        }
                    }
                })


                $("#aspect-body").on("click", ".increment_btn", (e) => {              
                    let id = e.target.id;
                    let index = id.split('_')[1];
                    let aspectName = e.target.dataset.name;
                    console.log(aspectName)                    
                    aspects[aspectName].free_invokes++;
                    document.querySelector("#col_" + index).innerHTML = aspects[aspectName].free_invokes
                });

                $("#aspect-body").on("click", ".decrement_btn", (e) => {
                    let id = e.target.id;
                    let index = id.split('_')[1];
                    let aspectName = e.target.dataset.name;
                    aspects[aspectName].free_invokes--;
                    document.querySelector("#col_" + index).innerHTML = aspects[aspectName].free_invokes
                });
             
                $("#aspect-body").on("click", ".delete_btn", (e) => {
                    let btn = null;
                    if (e.target.className == 'fa fa-trash') {
                        btn = e.target.parentElement;
                    } else {
                        btn = e.target;
                    }
                    let id = btn.id;
                    let index = id.split('_')[1];
                    let aspectName = btn.dataset.name;
                    aspects['-=' + aspectName] = {};
                    document.querySelector("#col_" + index).parentElement.remove();
                });              

            },
            'buttons': {
                'ok': {
                    'label': 'Save',
                    'callback': async function () {
                        await actor.update({
                            'system.situational_aspects': aspects
                        }, { noHook: true, render: false })
                    }
                },
                'cancel': {
                    'label': 'Cancel',
                    'callback': function () {

                    }
                }

            }

        },{
            height: 600
        }).render(true);
    } else {
        ui.notifications.info("No token or token has no situational aspects");
    }
}
export default renderAspectHelper;