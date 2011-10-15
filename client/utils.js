function collide(obj1, obj2) {
    var dx = obj1.gameObject.position.x - obj2.gameObject.position.x;
    var dy = obj1.gameObject.position.y - obj2.gameObject.position.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= obj1.gameObject.radius() + obj2.gameObject.radius()) {
        return true;
    }
    return false;
}

function removeElementFromArray(element, arr) {
	var index = arr.indexOf(element);
	arr.splice(index, 1);
	return index;
}