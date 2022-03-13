import React, {Component} from "react";
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";

export class PhaseAndTaskList extends Component {

    _isMounted = false;
    listOfOptions = [];
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            message: ""
        }

        const listOfOptions = JSON.parse(localStorage.getItem('taskList'));
        if(listOfOptions.length > 0) {
            this.listOfOptions = listOfOptions;
        }
    }

    componentDidMount() {
        this._isMounted = true;

        let arr = [];
        const taskList = localStorage.getItem("taskList");
        if (taskList.length > 0) {
            arr = JSON.parse(taskList);
        } else {
            arr = [];
        }

        let isAllSuccessful = false;
        for(let i = 0; i < arr.length; i++) {
            isAllSuccessful = arr[i].phase.successful;
            console.log(arr[i].phase.successful);
        }

        if(isAllSuccessful) {

            this.getMessage().then((data) => {

                const message = data.data.text;
                console.log(message);

                if (this._isMounted) {
                    this.setState(previousState => ({
                        message: message
                    }));
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleBlur = (field) => event =>  {
        console.log(field);

        if (this._isMounted) {
            this.setState(previousState => ({
                formControls: {
                    ...previousState.formControls,
                    [field]: {
                        ...previousState.formControls[field],
                        touched: true
                    }
                }
            }));
        }

        // setTimeout(() => {
        //     console.log(this.state.formControls[field]);
        // }, 1000);
    };

    checkBoxOnChange(event, index, parentIndex, inputObj) {
        const value = event.target.checked;

        let arr = [];
        const taskList = localStorage.getItem("taskList");
        if (taskList.length > 0) {
            arr = JSON.parse(taskList);
        } else {
            arr = [];
        }

        if(arr.length > 0) {
            console.log(value);
            arr[parentIndex].phase.tasks[index].checked = value;
            let hasErrors = false;
            let tasks = arr[parentIndex].phase.tasks;
            console.log(tasks);

            for(let i = 0; i < tasks.length; i++) {
                const checked = tasks[i].checked;
                console.log('checked: '+ checked);
                if(!checked) {
                    hasErrors = true;
                    break;
                }

            }

            console.log('hasError: ' + parentIndex);

            if(!hasErrors) {
                arr[parentIndex].phase.successful = true;
                if(parentIndex + 1 < arr.length) {
                    arr[parentIndex + 1].phase.unlocked = true;
                }
            } else {
                arr[parentIndex].phase.successful = false;
                if(parentIndex + 1 < arr.length) {
                    arr[parentIndex + 1].phase.unlocked = false;
                    arr[parentIndex + 1].phase.successful = false;
                }
            }

            const obj = JSON.stringify(arr);
            // console.log(obj);
            localStorage.setItem("taskList", obj);


            let isAllSuccessful = false;
            for(let i = 0; i < arr.length; i++) {
               isAllSuccessful = arr[i].phase.successful;
               console.log(arr[i].phase.successful);
            }


            if(isAllSuccessful) {

                this.setState(previousState => ({
                    ...previousState,
                    loading: true
                }));

                this.getMessage().then((data) => {

                    const message = data.data.text;
                    console.log(message);

                    if (this._isMounted) {
                        this.setState(previousState => ({
                            ...previousState,
                            message: message,
                            loading: false
                        }));
                    }
                });

                setTimeout(() => {
                    window.location.reload();
                }, 10);

            } else {

                if (this._isMounted) {
                    this.setState(previousState => ({
                        ...previousState,
                        message: "",
                        loading: false
                    }));
                }


                // Refresh used to update UI state instead of redux
                setTimeout(() => {
                    window.location.reload();
                }, 10);
            }

        }

    }



    async getMessage() {
       return axios({
           method: 'get',
           withCredentials: false,
           url: `https://uselessfacts.jsph.pl/random.json`
       });
    }

    render() {
        return (
            <div>
                <ToastContainer autoClose={false} />

                <h3>Add Phase</h3>

                <div>
                    {
                        this.listOfOptions.length > 0 ?
                            <div className="">
                                { this.listOfOptions.map((object, i) => {
                                return (
                                    <div key={i}>
                                        <div className="">
                                            <div className="phase-title">
                                                <span className="badge rounded-pill bg-dark">{i+1}</span>
                                                <span className={'padding-left'}>{object.phase.name}</span>
                                                <span className={'padding-left'}> { object.phase.successful ? <i className="fa fa-check" aria-hidden="true"/> : <h3/>}
                                                </span>
                                            </div>
                                            <div className="padding-left-40px">{
                                                object.phase.tasks.map((innerObject, k) => {
                                                    return (
                                                        <li key={'inner-' + k}>
                                                            <div className="form-check">
                                                                <input className="form-check-input"
                                                                       type="checkbox"
                                                                       checked={innerObject.checked}
                                                                       disabled={!object.phase.unlocked}
                                                                       onChange={(e) => this.checkBoxOnChange(e, k, i, innerObject)}
                                                                       value={innerObject.checked}
                                                                       id="flexCheckChecked" />
                                                                <label className="form-check-label"
                                                                       htmlFor="flexCheckChecked">
                                                                    {innerObject.name} {innerObject.checked}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }</div>
                                        </div>
                                    </div>
                                );
                            }) }
                            </div> :
                            <div>
                                No Phases found!
                            </div>
                    }

                    <div> {
                        this.state.loading ?
                            <div>
                                <div className="spinner-border text-dark" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            : <div>
                                {this.state.message}
                            </div>
                    }
                    </div>
                </div>




            </div>
        );
    }
}
