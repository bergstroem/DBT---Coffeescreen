<?

abstract class Service {
	private static $ME = NULL;

	private $this->parameters = array();

	public function __construct() {
		Service::ME = $this;
	}

	public function loadParameters($json) {
		$this->parameters = json_decode($json);
		if($this->parameters == NULL) {
			echo "Bad JSON string for the parameters."
			$this->parameters = array();
		}
	}

	protected function readParameter($key) {
		return $this->parameters[$key];
	}

	protected function createParameter($key, $name="", $defaultValue="") {
		$this->parameters[$key] = $defaultValue;
	}

	public function getParameters() {
		$this->createParameters();
	}

	private abstract function createParameters();

	public abstract function getView();



	public static instance() {
		if(Service::ME == NULL)
			Service::newInstance();

		return Service::ME;
	}

	private static newInstance();
}

if(isset($_POST["getView"])) {
	Service::instance()->loadParameters($_POST["parameters"]);
	echo Service::instance()->getView();
}else if(isset($_POST["getParameters"])) {
	echo Service::instance()->getParameters();
}

?>