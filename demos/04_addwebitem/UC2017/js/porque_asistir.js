// A $( document ).ready() block.
$( document ).ready(function() {
	function role_active(){
		$('#role-options').css('display', 'block');
		$('#role').css('border-bottom', '5px solid #5f246b');
		$('#role').css('background-color', '#863197');
		$('#role .title').css('color', 'white');
		$('#role .icon').css('background-position', '-60px 0');
		$('#industry-options').css('display', 'none');
		$('.display-testimony-header').css('visibility', 'visible');
		$('.display-testimony').css('visibility', 'visible');
		$('.display-testimony-footer').css('visibility', 'visible');
	}
	function role_inactive(){
		$('#role').removeClass('active');
		$('#role .title').css('color', '#595959');
		$('#role .icon').css('background-position', '0 0');
		$('#role').css('background-color', '#f0f0f0');
		$('#role').css('border-bottom', 'none');
		$('#role-options').css('display', 'none');
	}
	function industry_active(){
		$('#role-options').css('display', 'none');
		$('#industry-options').css('display', 'block');
		$('#industry').css('border-bottom', '5px solid #005f96');
		$('#industry').css('background-color', '#007ac2');
		$('#industry .title').css('color', 'white');
		$('#industry .icon').css('background-position', '-60px 0');
		$('.display-testimony-header').css('visibility', 'hidden');
		$('.display-testimony').css('visibility', 'hidden');
		$('.display-testimony-footer').css('visibility', 'hidden');
	}
	function industry_inactive(){
		$('#industry').removeClass('active');
		$('#industry .title').css('color', '#595959');
		$('#industry .icon').css('background-position', '0 0');
		$('#industry').css('background-color', '#f0f0f0');
		$('#industry').css('border-bottom', 'none');
		$('#industry-options').css('display', 'none');
	}
	// ROLE MENU
	function role_manager_active(){
		$('.role-wrapper.manager').hasClass('active');
		$('.display-text').text("Conoce de la mano de los expertos los últimos avances en la tecnología de Esri. Refuerza tus conocimientos y habilidades GIS. Consulta a los especialistas en productos de Esri y profesionales de GIS. Explora diferentes tópicos GIS en una gran variedad de charlas técnicas. Descubre cómo aprovechar al máximo tu inversión en GIS y/o la de su personal a cargo.");
		$('.role-icon.manager').css('background-position', '-50px 0');
		$('.role-wrapper.manager').css('background-color', 'white');
		$('.display-testimony').text("... Fue una jornada muy fructífera y sin duda las novedades en los productos y los nuevos lanzamientos son más que interesantes.");
		$('.display-testimony-footer').text("(Barbara Pasik – Gerente Operative de Información Territorial, Ministro de Desarrollo Urbano y Transporte)");
	}
	function role_manager_inactive(){
		$('.role-icon.manager').css('background-position', '0 0');
		$('.role-wrapper.manager').css('background-color', '#e6d2f0');
	}
	function role_analyst_active(){
		$('.role-wrapper.analyst').hasClass('active');
		$('.display-text').text("Encuéntrate con otros usuarios.  Intercambia soluciones alternativas, experimenta avances técnicos y reúnete con nuestros expertos. Prueba  nuevas soluciones, información de cómo funciona el software. Esta es tu oportunidad de brillar!");
		$('.role-icon.analyst').css('background-position', '-50px 0');
		$('.role-wrapper.analyst').css('background-color', 'white');
		$('.display-testimony').text("... ¡Me pareció muy buena como siempre! Me reencontré con gente muy querida además.");
		$('.display-testimony-footer').text("(Inés Guichandut – GCBA, USIG)");
	}
	function role_analyst_inactive(){
		$('.role-icon.analyst').css('background-position', '0 0');
		$('.role-wrapper.analyst').css('background-color', '#e6d2f0');
	}
	function role_researcher_active(){
		$('.role-wrapper.researcher').hasClass('active');
		$('.display-text').text("Este es el lugar donde puedes encontrar las herramientas GIS para apoyar tu investigación y proyectos. Habla con otros investigadores en tu campo, encuentra  innovaciones aplicables de otras industrias, y obtén la verdad sobre cómo funciona ArcGIS con las herramientas y modelos que necesitas.");
		$('.role-icon.researcher').css('background-position', '-50px 0');
		$('.role-wrapper.researcher').css('background-color', 'white');
		$('.display-testimony').text("... Disfrutamos y aprovechamos mucho de su desarrollo. Cada una de las actividades planteadas han sido de suma utilidad para aportarnos perspectivas técnicas y de negocio que nos permitan poder seguir avanzando en la implementación y difusión de estas tecnologías en la empresa.");
		$('.display-testimony-footer').text("(Ing. Pablo J. García – Aguas Bonaerenses S.A.)");
	}
	function role_researcher_inactive(){
		$('.role-icon.researcher').css('background-position', '0 0');
		$('.role-wrapper.researcher').css('background-color', '#e6d2f0');
	}
	function role_developer_active(){
		$('.role-wrapper.developer').hasClass('active');
		$('.display-text').text("¿Estás consiguiendo todo lo que puede salir de tus herramientas de desarrollo de Esri? Ven a la  UC y descubre cómo GIS conecta a prácticamente todo. La UC es una ventana única para que puedas permanecer en el centro de toda la acción en el siempre cambiante mundo de la alta tecnología. Asiste y participa en nuestras sesiones técnicas. Pon a punto tus habilidades de codificación. Participa con los ingenieros de Esri y Aeroterra.");
		$('.role-icon.developer').css('background-position', '-50px 0');
		$('.role-wrapper.developer').css('background-color', 'white');
		$('.display-testimony').text("... las felicitaciones de parte de San Miguel por el evento. Gustó mucho la herramienta Dashboard para lograr tableros de control.");
		$('.display-testimony-footer').text("(Danilo Garín – Jefe Sistemas de Información Geográfica, Municipalidad San Miguel)");
	}
	function role_developer_inactive(){
		$('.role-icon.developer').css('background-position', '0 0');
		$('.role-wrapper.developer').css('background-color', '#e6d2f0');
	}

	// INDUSTRY MENU
	function industry_localGov_active(){
		$('.industry-wrapper.localGov').hasClass('active');
		$('.display-text').text("Los gobernantes de todo el país utilizan GIS para mejorar sus flujos de trabajo y servicios a los ciudadanos. Ya sea para crear comunidades inteligentes y sostenibles o para obtener una mejor gestión de sus activos y orden de trabajo, planificación y priorización a través de la gestión de datos y herramientas de mapeo provistas por los GIS. Potencia el Desarrollo Económico de tu Comunidad: Con los GIS, las comunidades atraen nuevos negocios y ayudan a las empresas establecidas a ser más exitosos.");
		$('.industry-icon.localGov').css('background-position', '-50px 0');
		$('.industry-wrapper.localGov').css('background-color', 'white');
	}	
	function industry_localGov_inactive(){
		$('.industry-icon.localGov').css('background-position', '0 0');
		$('.industry-wrapper.localGov').css('background-color', '#d3eaf9');
	}
	function industry_resources_active(){
		$('.industry-wrapper.resources').hasClass('active');
		$('.display-text').text("Conoce los últimos avances en la agricultura de precisión para maximizar los beneficios, optimizar el rendimiento y garantizar valores de los alimentos. Descubre cómo los GIS ayudan a entender mejor la ciencia forestal, manejo de la tierra, la planificación sostenible de los bosques, y mucho más. Aprende cómo las compañías petroleras están cumpliendo con los objetivos de negocio en toda la organización, incluyendo exploración, producción, tubería, aguas abajo, HSE, y operaciones de negocio.");
		$('.industry-icon.resources').css('background-position', '-50px 0');
		$('.industry-wrapper.resources').css('background-color', 'white');
	}
	function industry_resources_inactive(){
		$('.industry-icon.resources').css('background-position', '0 0');
		$('.industry-wrapper.resources').css('background-color', '#d3eaf9');
	}
	function industry_utilities_active(){
		$('.industry-wrapper.utilities').hasClass('active');
		$('.display-text').text("Mejora tu atención al cliente, obtén análisis de riesgo más precisos y mayor eficiencia en el proceso de reclamos. La UC proporciona las mejores soluciones para potenciar tu negocio, solidificar la marca, encontrar la mejor ubicación para tu comercialización, información hiperfocal y el análisis de los clientes existentes y potenciales. Crea una cadena de suministro racionalizado a través del poder de Location Analytics.  Todo esto y mucho más lo encontrarás en la UC 2017.");
		$('.industry-icon.utilities').css('background-position', '-50px 0');
		$('.industry-wrapper.utilities').css('background-color', 'white');
	}
	function industry_utilities_inactive(){
		$('.industry-icon.utilities').css('background-position', '0 0');
		$('.industry-wrapper.utilities').css('background-color', '#d3eaf9');
	}
	function industry_negotions_active(){
		$('.industry-wrapper.negotions').hasClass('active');
		$('.display-text').text("Gran parte de tu ventaja competitiva es la “localización”. Empresas como JP Morgan Chase, JLL y Walgreens ya han tomado ventaja geográfica. Los GIS proporcionan un mejor entendimiento mediante la comprensión de la situación del mercado y hacia dónde se dirige. Encuentra en la Conferencia de Usuarios Esri toda la información para alcanzar la ventaja geográfica de tu negocio.");
		$('.industry-icon.negotions').css('background-position', '-50px 0');
		$('.industry-wrapper.negotions').css('background-color', 'white');
	}
	function industry_negotions_inactive(){
		$('.industry-icon.negotions').css('background-position', '0 0');
		$('.industry-wrapper.negotions').css('background-color', '#d3eaf9');
	}

	role_active();
	role_manager_active();

	$('#role').mouseenter(function(){
		if ($('#role').hasClass('active')){
		} else{
			$('#role .title').css('color', '#863197');
			$('#role .icon').css('background-position', '-60px 0');
		}
	});
	$('#role').mouseleave(function(){
		if ($('#role').hasClass('active')){
		} else{
			$('#role .title').css('color', '#595959');
			$('#role .icon').css('background-position', '0 0');
		}
	});
	$('#role').on('click', function(){
		$('#role').addClass('active');
		// Industry Inactive
		if ($('#industry').hasClass('active')){
			industry_inactive();
		}
		// Role Active
		role_active();
		role_manager_active();

		// Inactive rest of menu
		role_analyst_inactive();
		role_researcher_inactive();
		role_developer_inactive();
	});
	$('.role-wrapper.manager').on('click', function(){
		if ($('.role-wrapper.manager').hasClass('active')){

		} else {
			role_manager_active();
		}
		role_analyst_inactive();
		role_researcher_inactive();
		role_developer_inactive();
	});
	$('.role-wrapper.analyst').on('click', function(){
		if ($('.role-wrapper.analyst').hasClass('active')){

		} else {
			role_analyst_active();
		}
		role_manager_inactive();
		role_researcher_inactive();
		role_developer_inactive();
	});
	$('.role-wrapper.researcher').on('click', function(){
		if ($('.role-wrapper.researcher').hasClass('active')){

		} else {
			role_researcher_active();
		}
		role_manager_inactive();
		role_analyst_inactive();
		role_developer_inactive();
	});
	$('.role-wrapper.developer').on('click', function(){
		if ($('.role-wrapper.developer').hasClass('active')){

		} else {
			role_developer_active();
		}
		role_manager_inactive();
		role_analyst_inactive();
		role_researcher_inactive();
	});
	$('#industry').mouseenter(function(){
		if ($('#industry').hasClass('active')){
		} else{
			$('#industry .title').css('color', '#007ac2');
			$('#industry .icon').css('background-position', '-60px 0');
		}
	});
	$('#industry').mouseleave(function(){
		if ($('#industry').hasClass('active')){
		} else{
			$('#industry .title').css('color', '#595959');
			$('#industry .icon').css('background-position', '0 0');
		}
	});
	$('#industry').on('click', function(){
		$('#industry').addClass('active');
		// Role InActive
		if ($('#industry').hasClass('active')){
			role_inactive();
		}
		// Industry Active
		industry_active();
		industry_localGov_active();

		// Menu Inactive
		industry_resources_inactive();
		industry_utilities_inactive();
		industry_negotions_inactive();
	});
	$('.industry-wrapper.localGov').on('click', function(){
		if ($('.industry-wrapper.localGov').hasClass('active')){

		} else {
			industry_localGov_active();
		}
		industry_resources_inactive();
		industry_utilities_inactive();
		industry_negotions_inactive();
	});
	$('.industry-wrapper.resources').on('click', function(){
		if ($('.industry-wrapper.resources').hasClass('active')){

		} else {
			industry_resources_active();
		}
		industry_localGov_inactive();
		industry_utilities_inactive();
		industry_negotions_inactive();
	});
	$('.industry-wrapper.utilities').on('click', function(){
		if ($('.industry-wrapper.utilities').hasClass('active')){

		} else {
			industry_utilities_active();
		}
		industry_localGov_inactive();
		industry_resources_inactive();
		industry_negotions_inactive();
	});
	$('.industry-wrapper.negotions').on('click', function(){
		if ($('.industry-wrapper.negotions').hasClass('active')){

		} else {
			industry_negotions_active();
		}
		industry_localGov_inactive();
		industry_resources_inactive();
		industry_utilities_inactive();
	});
});
