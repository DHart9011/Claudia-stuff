// scenarios.js — All 30 Oklahoma Permit Quest scenarios

const SCENARIOS = [

  // ─── ZONE 1: DOWNTOWN DISTRICT ───────────────────────────────────────────

  {
    id: "dt1",
    zone: "downtown",
    zoneName: "Downtown District",
    zoneEmoji: "🏙️",
    title: "The Four-Way Standoff",
    situation: "You pull up to a four-way stop at exactly the same moment as another car approaching from your right. Both of you stop at the same time. The intersection is clear of other traffic, and you're both waiting to go straight.",
    icon: "🛑",
    question: "Who has the right of way at this four-way stop tie?",
    choices: [
      { text: "You go first — you got there at the same time so it's a coin flip", correct: false, explanation: "When two vehicles arrive simultaneously, the tie-breaker is clear: yield to the vehicle on your right." },
      { text: "The other car goes first because it is on your right", correct: true, explanation: "Correct! Oklahoma law says when vehicles arrive at a 4-way stop at the same time, the driver on the LEFT must yield to the driver on the RIGHT." },
      { text: "Whoever honks first gets to go", correct: false, explanation: "Honking is not part of any right-of-way rule! Yield to the car on your right." },
      { text: "The car going straight always yields to a car turning", correct: false, explanation: "That's not applicable here — both cars are going straight, and arrival order (or yielding right) determines who goes." }
    ],
    tip: "Oklahoma rule: at a 4-way stop tie, yield to the vehicle on your RIGHT."
  },

  {
    id: "dt2",
    zone: "downtown",
    zoneName: "Downtown District",
    zoneEmoji: "🏙️",
    title: "The Yellow Light Dash",
    situation: "You're driving 30 mph through downtown. You're about half a block from an intersection when the traffic light ahead turns yellow. A friend in the passenger seat says, 'Gun it — you can make it!'",
    icon: "🟡",
    question: "What should you do when the light turns yellow?",
    choices: [
      { text: "Speed up to clear the intersection before red", correct: false, explanation: "Speeding up on yellow is dangerous and illegal if you cannot safely clear the intersection. Yellow means PREPARE TO STOP." },
      { text: "Maintain speed — yellow just means caution", correct: false, explanation: "Yellow does not mean 'proceed with caution at the same speed.' It means slow down and prepare to stop." },
      { text: "Slow down and prepare to stop if you can do so safely", correct: true, explanation: "Correct! Yellow means the light is about to turn red. You should slow down and stop unless stopping would be unsafe (you're already in the intersection or too close to stop safely)." },
      { text: "Stop immediately no matter what", correct: false, explanation: "Stopping suddenly when you're too close to the intersection could cause a rear-end collision. Stop only when it is safe to do so." }
    ],
    tip: "In Oklahoma, a yellow traffic light means 'prepare to stop,' not 'speed up to beat red.'"
  },

  {
    id: "dt3",
    zone: "downtown",
    zoneName: "Downtown District",
    zoneEmoji: "🏙️",
    title: "Crosswalk Surprise",
    situation: "You're making a right turn onto a side street. As you begin the turn, you notice a pedestrian stepping off the curb and into the marked crosswalk ahead of you. The pedestrian has a walk signal.",
    icon: "🚶",
    question: "What must you do?",
    choices: [
      { text: "Honk to warn the pedestrian and proceed through the turn", correct: false, explanation: "Honking at a pedestrian who has the legal right of way is inappropriate. You must stop and yield." },
      { text: "Proceed slowly — they'll see you and wait", correct: false, explanation: "Never assume a pedestrian will yield to you. Oklahoma law requires drivers to yield to pedestrians in crosswalks." },
      { text: "Stop and yield to the pedestrian until they have crossed", correct: true, explanation: "Correct! Oklahoma law requires all drivers to yield to pedestrians in any marked crosswalk or at an intersection. Wait until the pedestrian has safely crossed." },
      { text: "You have a green light, so you have the right of way over pedestrians", correct: false, explanation: "A green light does not override the pedestrian's right of way in a crosswalk. Pedestrians with a walk signal always have right of way." }
    ],
    tip: "Oklahoma law: drivers must yield to pedestrians in crosswalks — even when making a turn on a green light."
  },

  {
    id: "dt4",
    zone: "downtown",
    zoneName: "Downtown District",
    zoneEmoji: "🏙️",
    title: "Left Turn Dilemma",
    situation: "You're at an intersection waiting to make a left turn. Your light is green (no green arrow). There is a steady stream of oncoming traffic, but there's a small gap coming up. You're in a hurry to get to your destination.",
    icon: "↩️",
    question: "When can you make the left turn?",
    choices: [
      { text: "Go now — oncoming cars will slow down for you", correct: false, explanation: "You cannot assume oncoming traffic will yield. They have the right of way and are not required to slow for your left turn." },
      { text: "You have a green light, so you can turn left anytime", correct: false, explanation: "A plain green light does NOT give you a protected left turn. You must still yield to oncoming traffic and pedestrians." },
      { text: "Wait for a safe gap in oncoming traffic, then turn when clear", correct: true, explanation: "Correct! When turning left on a green (no arrow), you must yield to all oncoming traffic and pedestrians. Only turn when there is a safe gap." },
      { text: "Flash your headlights to signal oncoming cars to let you through", correct: false, explanation: "Flashing headlights is not a legal signal for right of way. You must wait for a safe gap." }
    ],
    tip: "A green light without an arrow means yield to oncoming traffic before turning left in Oklahoma."
  },

  {
    id: "dt5",
    zone: "downtown",
    zoneName: "Downtown District",
    zoneEmoji: "🏙️",
    title: "Parking Precision",
    situation: "You're parallel parking on a downtown street. You've found a spot between two cars and you're maneuvering in. After a few back-and-forth moves, your car is parked, but you're not sure how far you are from the curb.",
    icon: "🅿️",
    question: "In Oklahoma, how far from the curb must you park when parallel parking?",
    choices: [
      { text: "Within 6 inches of the curb", correct: false, explanation: "Six inches is too strict — Oklahoma requires within 18 inches of the curb for parallel parking." },
      { text: "Within 18 inches of the curb", correct: true, explanation: "Correct! Oklahoma law requires your vehicle to be parked within 18 inches of the right-hand curb when parallel parking." },
      { text: "Within 3 feet of the curb", correct: false, explanation: "Three feet is too far. Oklahoma requires parallel-parked vehicles to be within 18 inches of the curb." },
      { text: "Any distance is fine as long as you're not blocking traffic", correct: false, explanation: "There is a specific legal requirement: within 18 inches of the curb. Parking too far out can obstruct traffic and result in a ticket." }
    ],
    tip: "Oklahoma parking law: parallel park within 18 inches of the right-hand curb."
  },

  // ─── ZONE 2: SCHOOL ZONE ─────────────────────────────────────────────────

  {
    id: "sz1",
    zone: "school",
    zoneName: "School Zone",
    zoneEmoji: "🏫",
    title: "Bus Stop Ahead",
    situation: "You're driving on a two-lane undivided road through a neighborhood. Up ahead, a school bus has stopped and its red lights are flashing. The stop arm is extended. Children are crossing the road in front of the bus.",
    icon: "🚌",
    question: "What must you do when approaching this school bus on an undivided road?",
    choices: [
      { text: "Stop only if you are behind the bus — traffic going the other way can keep moving", correct: false, explanation: "Wrong! On an undivided road, ALL traffic in both directions must stop when a school bus has its red lights flashing." },
      { text: "Slow to 15 mph and proceed carefully", correct: false, explanation: "Slowing down is not enough — you must come to a complete stop at least 25 feet away from the school bus." },
      { text: "Stop at least 25 feet back and wait until the red lights stop flashing", correct: true, explanation: "Correct! On any undivided road, all traffic in both directions must stop at least 25 feet from the school bus and wait until the flashing red lights stop and the stop arm is retracted." },
      { text: "Pull to the shoulder and pass slowly", correct: false, explanation: "You cannot pass a school bus with flashing red lights, even on the shoulder. You must stop completely." }
    ],
    tip: "Oklahoma law: stop at least 25 ft from a school bus with flashing red lights — BOTH directions on undivided roads."
  },

  {
    id: "sz2",
    zone: "school",
    zoneName: "School Zone",
    zoneEmoji: "🏫",
    title: "Speed Zone Ahead",
    situation: "You're driving past an elementary school at 2:45 PM on a Wednesday. You see a flashing yellow 'School Zone' sign and a posted speed limit that reads 25 mph. Children are visible on the sidewalk near the school entrance.",
    icon: "🐢",
    question: "What speed should you drive in this school zone?",
    choices: [
      { text: "35 mph — the regular speed limit applies unless school is in session", correct: false, explanation: "Children are visible, making the reduced speed limit active. You must drive 25 mph." },
      { text: "25 mph — the school zone limit applies because children are present", correct: true, explanation: "Correct! In Oklahoma, the 25 mph school zone speed limit applies when the zone is marked and children are present. At 2:45 PM with visible children, the limit is in effect." },
      { text: "15 mph — always slow to 15 in any school zone", correct: false, explanation: "Oklahoma school zones are 25 mph (not 15 mph) when children are present or when the flashing light is active." },
      { text: "The speed limit is only reduced when a crossing guard is present", correct: false, explanation: "The school zone speed limit applies whenever children are present or the flashing yellow beacon is active — no crossing guard required." }
    ],
    tip: "Oklahoma school zone speed limit: 25 mph when children are present or the flashing beacon is active."
  },

  {
    id: "sz3",
    zone: "school",
    zoneName: "School Zone",
    zoneEmoji: "🏫",
    title: "The Open Stop Arm",
    situation: "You're driving in the left lane of a four-lane divided road (with a raised median). A school bus in the right lane has stopped, red lights flashing, stop arm extended. Some students are still on the bus.",
    icon: "🛑",
    question: "What must drivers on the OPPOSITE side of the divided road do?",
    choices: [
      { text: "Stop — all traffic must stop on divided roads too", correct: false, explanation: "On a divided road with a raised median or physical barrier, oncoming traffic does NOT have to stop. The barrier separates traffic flow." },
      { text: "Continue at normal speed — the median separates you from the bus stop", correct: true, explanation: "Correct! On a divided highway with a raised median or physical barrier, only traffic on the SAME side as the bus must stop. Oncoming traffic may proceed." },
      { text: "Slow to 15 mph and be prepared to stop", correct: false, explanation: "On a divided road with a physical barrier, oncoming traffic may continue at normal speed. The physical separation removes the stopping requirement." },
      { text: "Stop only if children are crossing toward your side", correct: false, explanation: "The rule is simpler: on divided roads (with a physical barrier), oncoming traffic does not need to stop at all." }
    ],
    tip: "On divided roads with a median barrier, only traffic on the SAME side as the school bus must stop."
  },

  {
    id: "sz4",
    zone: "school",
    zoneName: "School Zone",
    zoneEmoji: "🏫",
    title: "Crosswalk Kids",
    situation: "You're driving near an elementary school. Three children start crossing in a marked crosswalk ahead of you. There is no traffic signal here — just the painted crosswalk. You need to turn right at the next street.",
    icon: "🧒",
    question: "What should you do?",
    choices: [
      { text: "Inch forward slowly to signal the children to hurry", correct: false, explanation: "Moving toward pedestrians in a crosswalk is dangerous and illegal. Stop and wait patiently." },
      { text: "Stop and wait until all children have completely crossed", correct: true, explanation: "Correct! Oklahoma law requires drivers to yield to pedestrians in crosswalks. Wait until all three children have safely reached the other side before proceeding." },
      { text: "Proceed since you have plenty of room to pass behind them", correct: false, explanation: "You must stop for pedestrians in any marked crosswalk — you cannot squeeze past, even if it seems like there's room." },
      { text: "Honk to let them know to hurry up — you have places to be", correct: false, explanation: "Honking at children crossing legally is inappropriate and could startle them into a dangerous reaction. Wait patiently." }
    ],
    tip: "Always yield to pedestrians in crosswalks — especially near schools where children may act unpredictably."
  },

  {
    id: "sz5",
    zone: "school",
    zoneName: "School Zone",
    zoneEmoji: "🏫",
    title: "Summer School Speed",
    situation: "It's July and you're driving past a school building. The school zone sign shows 25 mph. There is no flashing beacon active and you don't see any children outside. The regular road speed limit is 35 mph.",
    icon: "☀️",
    question: "What speed limit applies here?",
    choices: [
      { text: "25 mph — school zones always apply no matter what", correct: false, explanation: "The reduced school zone speed only applies when children are present or when the flashing beacon is active." },
      { text: "35 mph — the regular speed limit applies since no children are present and no beacon is flashing", correct: true, explanation: "Correct! Oklahoma's reduced school zone speed applies when children are present or the flashing beacon is active. With no children visible and no beacon, the regular 35 mph limit applies." },
      { text: "20 mph — you should always go slower than posted near schools", correct: false, explanation: "There is no legal requirement to drive slower than the posted limit near a school when the school zone conditions (children present or flashing beacon) are not active." },
      { text: "15 mph — summer school may be in session", correct: false, explanation: "Speculation isn't a legal standard. Without children visible or a flashing beacon, the regular speed limit is in effect." }
    ],
    tip: "Oklahoma school zone speed only applies when children are present or the flashing yellow beacon is activated."
  },

  // ─── ZONE 3: HIGHWAY HAVEN ───────────────────────────────────────────────

  {
    id: "hh1",
    zone: "highway",
    zoneName: "Highway Haven",
    zoneEmoji: "🛣️",
    title: "Safe Following Distance",
    situation: "You're driving 65 mph on the interstate behind a pickup truck. The road is dry and clear. Your friend tells you to get closer — 'You're leaving too much room, other cars will cut in front of you.'",
    icon: "📏",
    question: "What is the minimum recommended following distance in Oklahoma?",
    choices: [
      { text: "1 second — just stay close enough to react", correct: false, explanation: "1 second is dangerously short. At 65 mph you travel nearly 100 feet per second — far too little time to react and brake." },
      { text: "2 seconds — the two-second rule is standard", correct: false, explanation: "Oklahoma's driver's manual recommends a minimum of 3 seconds of following distance, not 2." },
      { text: "3 seconds — pick a landmark and count", correct: true, explanation: "Correct! Oklahoma recommends at least a 3-second following distance under normal conditions. Pick a fixed object and count 'one-one-thousand, two-one-thousand, three-one-thousand' after the car ahead passes it." },
      { text: "5 car lengths — count the cars between you", correct: false, explanation: "Car lengths change based on vehicle size and speed. Time-based (3 seconds) is the recommended method in Oklahoma." }
    ],
    tip: "Oklahoma requires at least 3 seconds of following distance — more in rain, fog, or heavy traffic."
  },

  {
    id: "hh2",
    zone: "highway",
    zoneName: "Highway Haven",
    zoneEmoji: "🛣️",
    title: "Rural Interstate Limit",
    situation: "You're cruising on a rural stretch of Oklahoma interstate heading west. The terrain is flat, the road is dry, and there are few other vehicles. You're not sure what the speed limit is, but you've heard it's high out here.",
    icon: "🤠",
    question: "What is the maximum speed limit on Oklahoma rural interstate highways?",
    choices: [
      { text: "65 mph", correct: false, explanation: "65 mph is the speed limit on urban interstate highways in Oklahoma, not rural interstates." },
      { text: "70 mph", correct: false, explanation: "70 mph is not the posted limit. Oklahoma set rural interstate limits at 75 mph." },
      { text: "75 mph", correct: true, explanation: "Correct! Oklahoma's maximum speed limit on rural interstate highways is 75 mph. Always watch for posted signs — some sections may be lower." },
      { text: "80 mph", correct: false, explanation: "80 mph exceeds Oklahoma's maximum. The rural interstate limit is 75 mph." }
    ],
    tip: "Oklahoma rural interstate: 75 mph max. Urban interstate: 65 mph max. Always follow posted signs."
  },

  {
    id: "hh3",
    zone: "highway",
    zoneName: "Highway Haven",
    zoneEmoji: "🛣️",
    title: "City Highway Speed",
    situation: "You're merging onto an interstate that runs through the middle of Oklahoma City. Buildings and overpasses surround you. There are lots of on-ramps, off-ramps, and other vehicles. You're unsure of the speed limit.",
    icon: "🌆",
    question: "What is the maximum speed on an urban/city interstate in Oklahoma?",
    choices: [
      { text: "55 mph", correct: false, explanation: "55 mph is too slow for an Oklahoma urban interstate. The limit is 65 mph." },
      { text: "60 mph", correct: false, explanation: "The urban interstate limit in Oklahoma is 65 mph, not 60 mph." },
      { text: "65 mph", correct: true, explanation: "Correct! Oklahoma urban interstate speed limit is 65 mph. This applies to interstates running through cities and densely populated areas." },
      { text: "75 mph", correct: false, explanation: "75 mph is for rural interstates. Urban interstates in Oklahoma have a 65 mph limit due to increased traffic complexity." }
    ],
    tip: "Oklahoma speed limits: 65 mph urban interstate, 75 mph rural interstate. Always obey posted signs."
  },

  {
    id: "hh4",
    zone: "highway",
    zoneName: "Highway Haven",
    zoneEmoji: "🛣️",
    title: "The Safe Pass",
    situation: "You're behind a slow-moving tractor on a two-lane highway. The road ahead is clear and you can see a long straight stretch. You move into the left lane to pass. As you complete the pass, the tractor is now behind you.",
    icon: "🚜",
    question: "When can you safely move back into the right lane after passing?",
    choices: [
      { text: "As soon as your front bumper clears the tractor's front bumper", correct: false, explanation: "Cutting back in too soon can clip the vehicle you just passed. Wait until you can see the whole vehicle in your rearview mirror." },
      { text: "When you can see the entire passed vehicle in your rearview mirror", correct: true, explanation: "Correct! The safe rule is to return to the right lane only when you can see the full vehicle you passed in your rearview mirror — giving a safe buffer." },
      { text: "After 2 seconds in the left lane", correct: false, explanation: "Time alone doesn't indicate safe distance. Use your rearview mirror to confirm clearance before returning to the right lane." },
      { text: "You don't have to return to the right lane — stay in the left lane", correct: false, explanation: "Oklahoma law requires drivers to return to the right lane after passing. The left lane is for passing, not travel." }
    ],
    tip: "When passing, return to the right lane only when you can see the passed vehicle's headlights in your rearview mirror."
  },

  {
    id: "hh5",
    zone: "highway",
    zoneName: "Highway Haven",
    zoneEmoji: "🛣️",
    title: "On-Ramp Merge",
    situation: "You're accelerating down an on-ramp to merge onto a busy highway. Traffic is flowing steadily at 70 mph in the right lane. You reach the end of the ramp and need to merge.",
    icon: "🔀",
    question: "Who has the right of way when merging onto the highway?",
    choices: [
      { text: "You do — the on-ramp gives you the right to enter traffic", correct: false, explanation: "The on-ramp does not grant right of way. Traffic already on the highway has the right of way." },
      { text: "Traffic already on the highway has right of way — you must yield and find a safe gap", correct: true, explanation: "Correct! Drivers merging onto a highway must yield to traffic already traveling on it. Match the highway speed and find a safe gap before merging." },
      { text: "Highway traffic must slow down to let merging cars in", correct: false, explanation: "Highway traffic is not legally required to accommodate merging vehicles. The merging driver must find a safe gap." },
      { text: "Whoever reaches the merge point first has right of way", correct: false, explanation: "Right of way belongs to traffic already on the highway — not whoever arrives at the merge point first." }
    ],
    tip: "When merging onto a highway, you must yield to existing traffic. Match their speed and find a gap."
  },

  // ─── ZONE 4: RAIN & NIGHT ─────────────────────────────────────────────────

  {
    id: "rn1",
    zone: "weather",
    zoneName: "Rain & Night",
    zoneEmoji: "🌧️",
    title: "Lights at Dusk",
    situation: "The sun just dipped below the horizon. It's 8:15 PM in June. The sky is getting dim but you can still see the road fairly well without headlights. Your passenger says you don't need headlights yet.",
    icon: "🌇",
    question: "When are headlights required in Oklahoma?",
    choices: [
      { text: "Only when it's completely dark and you can't see the road", correct: false, explanation: "Oklahoma law is time-based, not based on whether you can see. Headlights are required 30 minutes after sunset." },
      { text: "From 30 minutes after sunset to 30 minutes before sunrise", correct: true, explanation: "Correct! Oklahoma requires headlights from 30 minutes after sunset to 30 minutes before sunrise, AND whenever visibility is less than 1,000 feet." },
      { text: "Only between 10 PM and 5 AM", correct: false, explanation: "Oklahoma law does not use a clock-based window. Headlights are required starting 30 minutes after actual sunset." },
      { text: "Headlights are optional — only use them when you feel it's necessary", correct: false, explanation: "Headlight use is mandated by law in Oklahoma, not left to driver preference. Failure to use them when required can result in a ticket." }
    ],
    tip: "Oklahoma: headlights required 30 min after sunset to 30 min before sunrise, and whenever visibility is under 1,000 ft."
  },

  {
    id: "rn2",
    zone: "weather",
    zoneName: "Rain & Night",
    zoneEmoji: "🌧️",
    title: "Fog on the Highway",
    situation: "You're driving on a rural highway and you enter a thick patch of fog. Visibility drops rapidly. You can barely see 200 feet ahead of you. Your high beams seem to make things worse.",
    icon: "🌫️",
    question: "What should you do with your headlights in dense fog?",
    choices: [
      { text: "Use high beams — more light means better visibility", correct: false, explanation: "High beams reflect off fog particles and actually reduce visibility. Use low beams in fog." },
      { text: "Turn headlights off so you don't blind yourself with glare", correct: false, explanation: "Never turn off headlights in fog — other drivers need to see you. Use low beams." },
      { text: "Switch to low beams — they aim lower and reduce glare", correct: true, explanation: "Correct! In fog, rain, or snow, use low beams. High beams reflect off water particles and create glare that makes visibility worse. Also consider using front fog lights if your vehicle has them." },
      { text: "It doesn't matter — modern LED headlights work the same in fog", correct: false, explanation: "Regardless of headlight technology, high beams create blinding glare in fog. Low beams are always the correct choice." }
    ],
    tip: "In fog, use low beams — high beams reflect off water droplets and reduce visibility rather than improving it."
  },

  {
    id: "rn3",
    zone: "weather",
    zoneName: "Rain & Night",
    zoneEmoji: "🌧️",
    title: "Hydroplane Scare",
    situation: "It's been raining heavily. You're driving 55 mph on a wet highway when suddenly your steering feels light and unresponsive — like the car is floating. You realize you're hydroplaning.",
    icon: "💧",
    question: "What is the correct response when you begin to hydroplane?",
    choices: [
      { text: "Brake hard immediately to slow down", correct: false, explanation: "Hard braking while hydroplaning can cause you to lose control entirely. Ease off the gas instead." },
      { text: "Turn the steering wheel sharply in the direction you want to go", correct: false, explanation: "Sharp steering inputs while hydroplaning can spin the car. Make only gentle corrections once traction returns." },
      { text: "Ease off the gas gently and steer straight until traction returns", correct: true, explanation: "Correct! When hydroplaning, gently ease off the accelerator, hold the steering wheel straight, and let the car slow down naturally until the tires regain contact with the road." },
      { text: "Accelerate to power through the water", correct: false, explanation: "Accelerating while hydroplaning will make it worse. You need to reduce speed to let tires regain traction." }
    ],
    tip: "If hydroplaning: ease off the gas, steer straight, don't brake hard. Let the tires regain traction naturally."
  },

  {
    id: "rn4",
    zone: "weather",
    zoneName: "Rain & Night",
    zoneEmoji: "🌧️",
    title: "Night Vision Limits",
    situation: "You're driving alone at 11 PM on a rural two-lane road with no streetlights. With your low beams on, you can see about 200 feet ahead. You're traveling 60 mph.",
    icon: "🌙",
    question: "Is your speed appropriate given your headlight visibility?",
    choices: [
      { text: "Yes — 60 mph is the normal speed limit, so it's fine", correct: false, explanation: "Speed must be adjusted to conditions, including visibility. At 60 mph you travel 88 feet per second — stopping within 200 feet may be impossible." },
      { text: "No — you should slow down so you can stop within your visibility range", correct: true, explanation: "Correct! Oklahoma's basic speed rule requires you to drive at a speed where you can stop within the distance you can see. If your headlights only reach 200 feet, you must drive slow enough to stop in that distance." },
      { text: "Yes — as long as you're alert, reaction time compensates for the darkness", correct: false, explanation: "Alertness doesn't change physics. At 60 mph you need far more than 200 feet to stop safely. Slow down to match visibility." },
      { text: "Switch to high beams and maintain speed", correct: false, explanation: "Switching to high beams helps, but if there's oncoming traffic or fog, high beams can't always be used. The fundamental rule is to match speed to visibility." }
    ],
    tip: "Oklahoma's basic speed rule: never drive faster than allows you to stop within your visible distance ahead."
  },

  {
    id: "rn5",
    zone: "weather",
    zoneName: "Rain & Night",
    zoneEmoji: "🌧️",
    title: "Rainy Day Following",
    situation: "It's a rainy afternoon and the roads are slick. You're on the highway at 60 mph. Normally you keep a 3-second following distance, but your friend says that's plenty even in rain.",
    icon: "🌂",
    question: "How should you adjust following distance in rain or bad weather?",
    choices: [
      { text: "Keep the same 3-second distance — 3 seconds is the law", correct: false, explanation: "3 seconds is the MINIMUM for ideal conditions. Wet roads increase stopping distance, so you need more space." },
      { text: "Reduce to 2 seconds to stay tight with traffic flow", correct: false, explanation: "Reducing following distance in rain is extremely dangerous. Wet roads mean longer stopping distances." },
      { text: "Increase to at least 4–6 seconds in wet or slippery conditions", correct: true, explanation: "Correct! Oklahoma's driving manual recommends increasing following distance to 4–6 seconds (or more) in rain, snow, ice, or other poor conditions because stopping distances increase significantly on wet roads." },
      { text: "Following distance only matters at highway speeds — city rain driving is fine at 3 seconds", correct: false, explanation: "Rain affects stopping distance at all speeds. Increase following distance whenever roads are wet, regardless of your speed." }
    ],
    tip: "Increase following distance to 4–6 seconds in rain or poor conditions — wet roads double stopping distances."
  },

  // ─── ZONE 5: SIGN CITY ────────────────────────────────────────────────────

  {
    id: "sc1",
    zone: "signs",
    zoneName: "Sign City",
    zoneEmoji: "🚦",
    title: "Red Octagon Ahead",
    situation: "You're approaching an intersection and see a red octagonal sign. You've driven through here before and never seen another car at this intersection — it always feels like a waste of time to stop.",
    icon: "🛑",
    question: "What does a red octagonal STOP sign require you to do?",
    choices: [
      { text: "Slow to 5 mph and check for traffic", correct: false, explanation: "Slowing down is not the same as stopping. A STOP sign requires a complete stop." },
      { text: "Come to a complete stop, check for traffic, then proceed when safe", correct: true, explanation: "Correct! A STOP sign requires a complete stop — wheels must not be moving. After stopping, check for cross-traffic and pedestrians, then proceed when it is safe." },
      { text: "Stop only if there is other traffic present", correct: false, explanation: "You must stop at every STOP sign regardless of whether other traffic is present. It's always required." },
      { text: "The STOP sign is optional if you have clear visibility", correct: false, explanation: "STOP signs are never optional. Failing to stop is a traffic violation that can result in a ticket and points on your record." }
    ],
    tip: "A STOP sign always requires a complete stop — wheels fully stopped — before proceeding, every time."
  },

  {
    id: "sc2",
    zone: "signs",
    zoneName: "Sign City",
    zoneEmoji: "🚦",
    title: "Diamond in the Rough",
    situation: "Driving on a rural highway, you see a yellow diamond-shaped sign with a curved arrow. The sign is about 500 feet before a bend in the road.",
    icon: "⚠️",
    question: "What type of sign is a yellow diamond shape, and what does it mean?",
    choices: [
      { text: "A regulatory sign — you must take the action shown", correct: false, explanation: "Regulatory signs are white rectangles or specific shapes (like the red STOP octagon). Yellow diamonds are warning signs." },
      { text: "A warning sign — it alerts you to a hazard or change in road conditions ahead", correct: true, explanation: "Correct! Yellow diamond-shaped signs are warning signs. They alert drivers to upcoming hazards, curves, intersections, or changes in road conditions. They advise caution but do not give a specific command." },
      { text: "A guide sign — it provides directions or mileage information", correct: false, explanation: "Guide signs are green (highway) or blue (services). Yellow diamonds are warning signs." },
      { text: "A construction sign — it means road work is ahead", correct: false, explanation: "Construction/work zone signs are orange diamonds, not yellow. Standard yellow diamonds warn of general road hazards." }
    ],
    tip: "Yellow diamond signs = warning signs. They alert you to upcoming hazards — slow down and be prepared."
  },

  {
    id: "sc3",
    zone: "signs",
    zoneName: "Sign City",
    zoneEmoji: "🚦",
    title: "Railroad Crossing",
    situation: "You're approaching a railroad crossing marked with an X-shaped crossbuck sign. There is no flashing light or gate. Trees and brush block your view of the tracks in both directions. You cannot tell if a train is coming.",
    icon: "🚂",
    question: "What must you do when vision is blocked at a railroad crossing?",
    choices: [
      { text: "Speed up to cross quickly in case a train is coming", correct: false, explanation: "Speeding up is the most dangerous response. If a train is near, you cannot outrun it — trains are far faster than they appear." },
      { text: "Stop, look and listen, and proceed only when safe", correct: false, explanation: "Stopping is good, but Oklahoma has a specific rule: when your vision is obstructed, you must slow to 15 mph before crossing." },
      { text: "Slow to 15 mph, look and listen carefully, and cross only if safe", correct: true, explanation: "Correct! Oklahoma law requires drivers to slow to 15 mph when vision is restricted at a railroad crossing. Look and listen carefully in both directions before crossing." },
      { text: "Only stop if there are flashing lights or a gate", correct: false, explanation: "You must treat all railroad crossings with caution, especially when visibility is limited, regardless of whether lights or gates are present." }
    ],
    tip: "Oklahoma law: slow to 15 mph when vision is restricted at a railroad crossing — even without signals."
  },

  {
    id: "sc4",
    zone: "signs",
    zoneName: "Sign City",
    zoneEmoji: "🚦",
    title: "Yield Sign Rules",
    situation: "You're approaching a T-intersection where you need to turn onto a main road. There's a triangular red-and-white YIELD sign facing you. A car is coming from the left on the main road.",
    icon: "🔺",
    question: "What does a YIELD sign require you to do?",
    choices: [
      { text: "Stop completely, then go after 3 seconds", correct: false, explanation: "A YIELD sign doesn't require a complete stop unless it's necessary to safely yield. You slow down and yield, stopping if needed." },
      { text: "Slow down, and stop if necessary, to give right of way to traffic on the main road", correct: true, explanation: "Correct! A YIELD sign means slow down and give right of way to oncoming traffic. Stop if necessary. You may proceed without stopping only if it is safe to do so." },
      { text: "Yield only applies to traffic coming from your left", correct: false, explanation: "A YIELD sign means yield to ALL traffic that has right of way — not just traffic from one direction." },
      { text: "A YIELD sign means the same as a STOP sign", correct: false, explanation: "YIELD and STOP are different. STOP requires you to always come to a complete stop. YIELD means slow down and give way, stopping only if needed." }
    ],
    tip: "YIELD = slow down and give right of way. Stop only if necessary. STOP = always come to a complete stop."
  },

  {
    id: "sc5",
    zone: "signs",
    zoneName: "Sign City",
    zoneEmoji: "🚦",
    title: "Sign Color Code",
    situation: "You're studying for your permit test and your friend quizzes you: 'What color and shape are signs that tell you the rules of the road — like speed limits, no U-turn, and do not enter?'",
    icon: "📋",
    question: "What do white rectangular signs indicate?",
    choices: [
      { text: "Warning signs — they alert you to hazards ahead", correct: false, explanation: "Warning signs are yellow diamonds. White rectangles are regulatory signs." },
      { text: "Guide signs — they give directions and mileage", correct: false, explanation: "Guide signs are green (highway info) or blue (services). White rectangles are regulatory signs." },
      { text: "Regulatory signs — they tell you rules you must follow (speed limits, no U-turn, etc.)", correct: true, explanation: "Correct! White rectangular signs are regulatory signs. They establish legal requirements like speed limits, lane restrictions, turn prohibitions, and access rules. You must obey them." },
      { text: "Service signs — they point to gas stations and rest areas", correct: false, explanation: "Service signs are blue. White rectangles are regulatory signs that establish road rules." }
    ],
    tip: "Sign colors: white rectangle = regulatory (rules), yellow diamond = warning, green = guide, blue = services."
  },

  // ─── ZONE 6: EMERGENCY ZONE ──────────────────────────────────────────────

  {
    id: "ez1",
    zone: "emergency",
    zoneName: "Emergency Zone",
    zoneEmoji: "🚨",
    title: "Move Over Oklahoma",
    situation: "You're driving on a four-lane highway (two lanes each direction). In the right lane ahead, a police car is parked on the shoulder with its lights flashing. An officer is speaking with a driver who was pulled over. The speed limit is 65 mph.",
    icon: "🚓",
    question: "What does Oklahoma's Move Over Law require you to do?",
    choices: [
      { text: "Nothing — as long as you don't hit the police car, you're fine", correct: false, explanation: "Oklahoma's Move Over Law requires action whenever an emergency vehicle is on the shoulder with lights on." },
      { text: "Move to the left lane OR slow to at least 15 mph below the speed limit if you cannot move over", correct: true, explanation: "Correct! Oklahoma's Move Over Law requires drivers to: (1) move one lane away from the emergency vehicle if possible, OR (2) reduce speed to at least 15 mph below the posted speed limit when unable to move over." },
      { text: "Slow to 25 mph as you pass the police car", correct: false, explanation: "The law specifies slowing 15 mph BELOW the speed limit (so 50 mph at 65 mph), not an arbitrary 25 mph." },
      { text: "Stop completely before passing the emergency vehicle", correct: false, explanation: "Stopping on the highway would be dangerous. The law requires moving over or slowing to 15 mph below the speed limit." }
    ],
    tip: "Oklahoma Move Over Law: move one lane away OR slow 15 mph below the limit for vehicles on the shoulder with lights on."
  },

  {
    id: "ez2",
    zone: "emergency",
    zoneName: "Emergency Zone",
    zoneEmoji: "🚨",
    title: "Ambulance Approaching",
    situation: "You're driving through an intersection when you hear a siren. In your rearview mirror, you see an ambulance with lights flashing approaching rapidly from behind. You're in the middle of the intersection.",
    icon: "🚑",
    question: "What should you do when an emergency vehicle with lights and siren is approaching?",
    choices: [
      { text: "Speed up to clear the intersection quickly, then pull over", correct: false, explanation: "Speeding up may help briefly, but the key is to pull to the right and stop as quickly and safely as possible." },
      { text: "Stop where you are in the intersection", correct: false, explanation: "Stopping in the intersection can block the emergency vehicle's path. Pull completely to the right and clear the intersection first." },
      { text: "Pull to the right side of the road, clear of intersections, and stop", correct: true, explanation: "Correct! Oklahoma law requires drivers to pull to the right edge of the road, clear the intersection, and stop when an emergency vehicle approaches with lights and/or siren. Stay stopped until it passes." },
      { text: "Continue at your normal speed — the ambulance will go around you", correct: false, explanation: "You are legally required to yield to emergency vehicles. Continuing at normal speed is illegal and could delay life-saving care." }
    ],
    tip: "When an emergency vehicle approaches with lights/siren: pull RIGHT, clear intersections, stop, and stay until it passes."
  },

  {
    id: "ez3",
    zone: "emergency",
    zoneName: "Emergency Zone",
    zoneEmoji: "🚨",
    title: "Blood Alcohol Limits",
    situation: "You're at a party and had a couple of drinks. You're 17 years old and have a learner's permit. You feel 'fine' and a friend says you're okay to drive since you only had two drinks. Your blood alcohol content (BAC) is about .03.",
    icon: "🍺",
    question: "What is the legal BAC limit for someone under 21 in Oklahoma?",
    choices: [
      { text: ".08 — same as adults, since you feel fine", correct: false, explanation: "Oklahoma has a much stricter standard for drivers under 21. The .08 limit is for adults 21 and older." },
      { text: ".05 — slightly lower than the adult limit", correct: false, explanation: "Oklahoma's limit for under-21 drivers is even stricter than .05. It is .02." },
      { text: ".02 — essentially zero tolerance for underage drivers", correct: true, explanation: "Correct! Oklahoma law sets the BAC limit for drivers under 21 at .02 — essentially zero tolerance. A .03 BAC would mean a DUI charge for a 17-year-old, with serious consequences including loss of driving privileges." },
      { text: "There is no limit — you can't get a DUI as a minor", correct: false, explanation: "Minors absolutely can be charged with DUI in Oklahoma. The limit is just stricter (.02 vs .08 for adults)." }
    ],
    tip: "Oklahoma: .08 BAC limit for adults, .02 (near-zero tolerance) for drivers under 21. Never drink and drive."
  },

  {
    id: "ez4",
    zone: "emergency",
    zoneName: "Emergency Zone",
    zoneEmoji: "🚨",
    title: "Phone Down, Permit Holders",
    situation: "You have your learner's permit and you're driving with your parent in the passenger seat. Your phone buzzes — it's a text from your best friend. You really want to read it, and you think a quick glance won't hurt.",
    icon: "📵",
    question: "Can you use your cell phone while driving with a learner's permit in Oklahoma?",
    choices: [
      { text: "Yes — as long as you use hands-free mode", correct: false, explanation: "Oklahoma prohibits ALL cell phone use for learner's permit holders — including hands-free. The ban is complete, not just handheld." },
      { text: "Yes — reading texts is okay, just no calling", correct: false, explanation: "All cell phone use — calls, texts, apps — is illegal for learner's permit holders in Oklahoma." },
      { text: "No — all cell phone use is illegal for learner's permit holders", correct: true, explanation: "Correct! Oklahoma law prohibits learner's permit holders from using a cell phone at all while driving — no texting, no calling, no apps, not even hands-free. This restriction continues through the intermediate license stage." },
      { text: "It depends — check your permit card for restrictions", correct: false, explanation: "The restriction is set by Oklahoma law for all permit holders, not on a case-by-case basis. All cell phone use is banned." }
    ],
    tip: "Oklahoma learner's permit: NO cell phone use whatsoever while driving — not even hands-free."
  },

  {
    id: "ez5",
    zone: "emergency",
    zoneName: "Emergency Zone",
    zoneEmoji: "🚨",
    title: "Highway Breakdown",
    situation: "You're driving on the interstate when your car suddenly loses power and starts slowing down. You can tell something is seriously wrong. You're in the right lane with traffic behind you.",
    icon: "🔧",
    question: "What should you do when your car breaks down on the highway?",
    choices: [
      { text: "Stop in the travel lane and put on your flashers — someone will see you", correct: false, explanation: "Stopping in a travel lane is extremely dangerous. You must get as far off the road as possible immediately." },
      { text: "Get as far right as possible onto the shoulder, turn on hazard lights, and stay in the car with seatbelt on", correct: true, explanation: "Correct! Pull as far right as possible onto the shoulder. Turn on your hazard lights immediately. If possible, stay in the car with your seatbelt on (safer than standing on the shoulder) and call for help." },
      { text: "Signal and slowly make your way to the nearest exit even if it's 2 miles away", correct: false, explanation: "If the car is losing power rapidly, you may not make it. Pull right immediately onto the shoulder rather than risk stopping in a lane." },
      { text: "Get out of the car immediately and stand behind the guardrail", correct: false, explanation: "Getting out on a highway shoulder is dangerous due to traffic. Stay in the car with seatbelt on unless there is a fire or other immediate hazard." }
    ],
    tip: "Highway breakdown: pull far right, hazard lights on, stay in car with seatbelt fastened, and call for help."
  }

];
