from config import db
from flask import Blueprint, jsonify, request

manTasks = Blueprint('manager/tasks', __name__)
staTasks = Blueprint('staff/tasks', __name__)
#-----------------manager access-------------------#

# See all tasks
# For frontend: Is pagination a front end implementation? i.e.
# scroll down and load additional. Not load all tasks onto the page
# at once?
@manTasks.route("/<uId>", methods=['GET'])
def manager_tasks(uId):
    
    # gets all tasks from the Tasks Collection that the manager created
    all_tasks = db.Tasks.find({"manager_assigned": uId})

    # convert Cursor type to list
    tasks_list = list(all_tasks)

    if not tasks_list:
        return jsonify({"message": "You don't have any tasks"})

    # Returns all tasks from Tasks Collection
    return jsonify(tasks_list)

# Creates new task
# For frontend: cannot submit if required fields aren't provided
# required fields = taskDescription, Priority, Due Date, Assign Staff
# For frontend: make priority field drop down = {low, medium, high}
# For frontend: 'Add Task' button should not be visible for staff
# For frontend: If possible, can add drop down selection of staff to
# assign based on staff accounts, instead of trying to string match
# their names on input
@manTasks.route("/create/<uId>", methods=['POST'])
def manager_create_task(uId):
    
    # Fetch all ids and convert them to integers
    all_task_ids = [int(task['_id']) for task in db.Tasks.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_task_ids:
        taskId = 1
    else:
        max_id = max(all_task_ids)
        taskId = max_id + 1

    # note, need to have '_id' in order to avoid mongodb creating an
    # object id
    new_task = {
        "_id": str(taskId),
        "manager_assigned": uId,
        "task_description": request.form['taskDescription'],
        "client_assigned": request.form['client'],
        "product": request.form['product'],
        "product_quantity": request.form['productQuantity'],
        "priority": request.form['priority'],
        "due_date": request.form['dueDate'],
        "staff_member_assigned": request.form['staffMemberAssigned'],
        "complete": False
    }

    # inserts new task into collection
    db.Tasks.insert_one(new_task)

    # Returns success message to user
    return jsonify({"message": "Task was succesfuly created."})

    # delete task
@manTasks.route("/delete/<taskId>", methods=['POST'])
def manager_task_delete(taskId):
    
    # delete task from db based on task ID
    result = db.Tasks.delete_one({"_id":taskId})

    if result.deleted_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400

    # edit task
    # for frontend: managers cannot edit status, only staff can
    # managers cannot edit task id either
@manTasks.route("/edit/<taskId>", methods=['POST'])
def manager_task_edit(taskId):

    # parse json object for data to update i.e. due date
    edit = request.get_json()

    # updates fields according to provided JSON
    result = db.Tasks.update_one({"_id": taskId}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400    

#-----------------staff access-------------------#

@staTasks.route("/<uId>", methods=['GET'])
def staff_tasks(uId):
    
    # gets all tasks from the Tasks Collection that are assigned to the staff member
    all_tasks = db.Tasks.find({"staff_member_assigned": uId})

    # convert Cursor type to list
    tasks_list = list(all_tasks)

    if not tasks_list:
        return jsonify({"message": "You don't have any tasks"})

    # Returns all tasks from Tasks Collection for that staff member
    return jsonify(tasks_list)

# update completion 
@staTasks.route("/status/<taskId>", methods=['POST'])
def staff_status(taskId):

    # parse json object for data to update i.e. completed
    status = request.get_json()
    
    # updates completion field according to button click 
    result = db.Tasks.update_one({"_id": taskId}, {"$set": status})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400

    # edit task
    # for frontend: staff can edit their own assignment or their manager's assignment
@staTasks.route("/edit/<taskId>", methods=['POST'])
def staff_task_edit(taskId):
    
    # parse json object for data to update i.e. due date
    edit = request.get_json()

    # updates fields according to provided JSON
    result = db.Tasks.update_one({"_id": taskId}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400  
    